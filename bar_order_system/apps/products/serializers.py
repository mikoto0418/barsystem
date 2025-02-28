from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'alcohol_content',
            'price',
            'temperature_requirement',
            'description'
        ] 