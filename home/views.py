from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.views import View

from django.conf import settings
from rest_framework.authtoken.models import Token


class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render_to_response('index.html', {'request': request})


class ReturnToken(View):
    def get(self, request,  *args, **kwargs):
        Token.objects.filter(user=request.user).delete()
        token = Token.objects.get_or_create(user=request.user)
        token = token[0].key
        return HttpResponseRedirect(f'{settings.FRONTEND_URL}#{token}')
