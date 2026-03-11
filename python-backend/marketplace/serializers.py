from rest_framework import serializers
from .models import Product, Category, Order, OrderItem, CalculatorSave, SupplierProfile

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'children']

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierProfile
        fields = ['id', 'company_name', 'is_verified']

class ProductSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_time']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'status']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )

    class Meta:
        model = Order
        fields = ['total_amount', 'shipping_address', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            # item_data should contain product_id and quantity
            # price_at_time should ideally be fetched from product to avoid checking frontend tampering, 
            # but for MVP we might trust or re-fetch.
            # Let's re-fetch price for security.
            product = Product.objects.get(id=item_data['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                price_at_time=product.price
            )
        return order

class CalculatorSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculatorSave
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
