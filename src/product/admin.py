from django.contrib import admin

# Register your models here.
from .models import*

admin.site.register(Variant)
admin.site.register(ProductVariant)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(ProductVariantPrice)

