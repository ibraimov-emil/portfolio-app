from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, OrderViewSet, CalculatorSaveViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'calculators', CalculatorSaveViewSet, basename='calculator')

urlpatterns = [
    path('', include(router.urls)),
]
