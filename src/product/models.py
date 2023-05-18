from django.db import models
from config.g_model import TimeStampMixin


# Create your models here.
class Variant(TimeStampMixin):
    title = models.CharField(max_length=40, unique=True)
    description = models.TextField()
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.title
    
    class Meta:
        db_table="variants"

class Product(TimeStampMixin):
    title = models.CharField(max_length=255)
    sku = models.SlugField(max_length=255, unique=True)
    description = models.TextField()

    def __str__(self) -> str:
        return self.title


    class Meta:
        db_table="products"

class ProductImage(TimeStampMixin):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    file_path = models.URLField()
    def __str__(self) -> str:
        return self.product.title 
    

    class Meta:
        db_table="product_images"


class ProductVariant(TimeStampMixin):
    variant_title = models.CharField(max_length=255)
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE)
    product = models.ForeignKey(Product,related_name="product_variant", on_delete=models.CASCADE)
    def __str__(self) -> str:
        return self.variant_title
    
    class Meta:
        db_table="product_variants"

    def __str__(self) -> str:
        return self.variant_title



class ProductVariantPrice(TimeStampMixin):
    product_variant_one = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True,
                                            related_name='product_variant_one')
    product_variant_two = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True,
                                            related_name='product_variant_two')
    product_variant_three = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True,
                                              related_name='product_variant_three')
    price = models.FloatField()
    stock = models.FloatField()
    product = models.ForeignKey(Product,related_name="product", on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return self.product.title
    

    class Meta:
        db_table="product_variant_price"

