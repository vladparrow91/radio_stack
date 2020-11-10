# Setup

## Backend

`$ python3 -m venv venv`

`$ source venv/bin/activate`

`$ pip install wheel`

`$ pip install -r requirements.txt`

`$ ./manage.py migrate`


## Frontend
`$ npm i`
`$ npm run build`

## Create admin
`$ ./manage.py createsuperuser`

# Run
в одном терминале

`$ source venv/bin/activate`

`$ ./manage.py runserver`

заходить на http://localhost:8000


# Create React component + DRF GET/PUT

## React

### сама компонента:

Где то в константах для удобства объявляем: 
`const componentDataURL = "/api/uptime";`

```
class TestComponent extends React.Component {
 ....
}
```

### State
Это объект состояния компоненты.

примерный, наиболее общий, вариант.

```
  state = {
    error: null,
    loading: false,
    saving: false,
    success: false,
    data: {},
  };

```

### Init

Метод componentDidMount срабатывает при стыковке компоненты в DOM(не совсем так, но смысл тот же).

Обычно актуализируется состояние компоненты. 
Мы будем запрашивать  данные с сервера

```
componentDidMount() {
    this.handleFetchData();
}
```

Тут и запрашиваем. Думаю все понятно.

```
handleFetchData() {
    this.setState({ loading: true });
    authAxios
      .get(URL)
      .then(res => {
        this.setState({
          loading: false,
          data: res.data,
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
}
```

### Render

Тот самый метод, который и рисует компоненту в DOM.

На чем писать html - дело личное. Мне одинаково все ненравится :)

Компоненты из semantic-ui-react достаточно удобны, но как по мне излишество.

```
render() {
    const { data, success, error, loading, saving } = this.state;
    return (
        <React.Fragment>
            {data.uptime}
            <Button onClick={this.handleClick}>Click</Button> 
        </React.Fragment>
    )
}
```

### Action

Теперь попробуем что то сделать.

Отправим на сервер переменную *refresh* и всё из *data*. 
```
handleClick() {
   const { data, success, error, loading, saving } = this.state;
   this.setState({ loading: true });
   authAxios
        .post(URL, 
            {
            ...data,
            "refresh": true
            }
        )
        .then(res => {
            this.setState({
              loading: false
            });
            this.handleFetchData();
        })
        .catch(err => {
            this.setState({ error: err, loading: false });
        }
    );
} 
```
 
# DRF

первое и самое понятное - делаем роутинг. сделаем простой и понятный.
```
path('uptime/', UptimeView.as_view(),
``` 

для него создаем вьюху
```
class UptimeView(APIView):
    def get(self, request, *args, **kwargs(: 
        return Response({'ok': True}, 200)
```

если хотим что то делать из вне - создаем метод *post* ну или *put*

```
    def post(self, request, *args, **kwargs(:
        info = request.data['info']
        ...
        return Response({'ok': True}, 200)
```


впринципе все...

если наша вьюха работает с моделью то проще сделать специальную.
например:

```
class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()

```

*permission_classes* - права доступа

*serializer_class* - это поинтереснее наше описание формата данных

*queryset* - откуда данные берутся


### кратко и сериализаторах

есть два варианта:

самый простой, от модели:
```
class UserDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = 'id', 'first_name', 'last_name',
```

моет сам отлично упаковать мдель в данные для json ну или наборот.


или покруче

```
class DocumentDataSerializer(serializers.Serializer):
    """Document generation request"""
    uid = serializers.CharField(max_length=50, help_text='Unique Id for generated document')
    assistant = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), default=None)
    parent = serializers.PrimaryKeyRelatedField(queryset=Parent.objects.all(), default=None)
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), default=None)
    template_id = serializers.PrimaryKeyRelatedField(queryset=ReportTemplate.objects.all(), default=None)
    template_name = serializers.CharField(max_length=50, help_text='Template name', default=None)
    document = serializers.JSONField(help_text='JSON document data')
```

 у нас тут нет модели. мы просто принимаем понятные нам данные.
 ну или отправляем
 
 напоследок пример упоротого сериализатора.
 
 ```
class ContentSerializer(serializers.ModelSerializer):
    content_data = serializers.SerializerMethodField()

    content_type_serializers = dict()

    @staticmethod
    def register_content_type(type_cls):
        model = apps.get_model(type_cls.Meta.model._meta.app_label, type_cls.Meta.model.__name__)
        ContentSerializer.content_type_serializers[f"{model._meta.app_label}.{model.__name__}"] = type_cls
        return type_cls

    def get_content_data(self, obj):
        app_label, model_name = obj.content_type.split(".")
        model = apps.get_model(app_label, model_name)
        serializer = self.content_type_serializers.get(obj.content_type)
        if model and serializer:
            try:
                content_data = model.objects.get(pk=obj.id)
                return serializer(content_data).data
            except ObjectDoesNotExist:
                return None
        return None

    class Meta:
        model = models.Content
        fields = ("id", "counter", "title", "content_type", "content_data")

```

## Параметры

вобеще говоря все можноещё проще. даже с параметрами.
но тут нет ни маунта не создать какие либо события.

```
function simpleText(props) {
  return <h1>Hello World! {props.title}</h1>;
}
```
вот как передать параметр
```
<simpleText title="Forever"/>
```

а от как если классом описывать

```
class simpleText extends Component {
  render() {
    return <h1>I'm class {this.props.title}</h1>;
  }
}
```

