# Пример импорта из файла в админке

## admin.py
```
@admin.register(TestModel)
class TestAdminAdmin(admin.ModelAdmin):
    def import_from_file(self, request):
        if 'file2import' in request.FILES:
            
            # само процесс импорта
            ....
            #
 
            self.message_user(request, f'Проимпортировали {len(objects)}.')

    def get_urls(self):
        urls = super().get_urls()
        import_urls = [
            path(
                'import_from_file/',
                self.admin_site.admin_view(self.import_from_file, cacheable=False),
                name='import_from_file'
            ),
        ]
        return import_urls + urls
```

## templates/admin/testapp/testmodel/change_list.html
```
{% extends "admin/change_list.html" %}
{% load i18n admin_urls %}
{% block  object-tools %}
    <div>
      <form action="{% url 'admin:import_from_file' %}" method="POST" enctype="multipart/form-data">
        {% csrf_token %}
       <button type="submit" style="width:100%">Импорт платежей</button><br><br>
        <b> файла для импорта</b><br>
        <input type="file" name="file2import">
      </form>
    </div>
{% endblock %}

```