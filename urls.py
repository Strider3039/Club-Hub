from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('backend.backend.urls')),  # Include the backend's URL configuration
]
