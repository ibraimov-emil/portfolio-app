from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Order, CalculatorSave
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, OrderCreateSerializer, CalculatorSaveSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(parent=None)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'supplier']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    @action(detail=False, methods=['get'])
    def my_products(self, request):
        if not hasattr(request.user, 'supplierprofile'):
             return Response({"error": "User is not a supplier"}, status=403)
        products = Product.objects.filter(supplier=request.user.supplierprofile)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Auto-assign supplier if user has one, else error or handle logic
        # For now, simplistic
        if hasattr(self.request.user, 'supplierprofile'):
            serializer.save(supplier=self.request.user.supplierprofile)
        else:
             # Handle case where user is not a supplier
             # Ideally create a profile or error out
             # For MVP, let's auto-create a profile if missing?
             # Or just raise error
             raise serializers.ValidationError("You must have a supplier profile to create products.")

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CalculatorSaveViewSet(viewsets.ModelViewSet):
    serializer_class = CalculatorSaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CalculatorSave.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
