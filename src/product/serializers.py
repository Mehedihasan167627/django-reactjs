from .models import Product,ProductImage,ProductVariantPrice,ProductVariant,Variant
from rest_framework import serializers


class ProductSerializer(serializers.ModelSerializer):
    variant=serializers.JSONField()
    images=serializers.JSONField()
    class Meta:
        model=Product
        fields=["title","sku","description","variant","images"]
    
    def validate(self, attrs):
        variants=attrs.pop("variant")
        images=attrs.pop("images")
        print(images)
        # if len(images)==0:
        #    raise serializers.ValidationError("Images field is required")
        if len(variants)==0:
           raise serializers.ValidationError("Varient field is required")
        # print(variants)
        product=Product.objects.create(
            title=attrs.get("title"),
            sku=attrs.get("sku"),
            description=attrs.get("description"),
        )
 
        for variant in variants:
            var=str(variant["variant"]).split("/")[:-1]
       
            price=variant["price"]
            stock=variant["stock"]
     
            if len(var)==3:
               variant_1= ProductVariant.objects.filter(
                   variant_title=var[0],
               ).last()
               variant_2= ProductVariant.objects.filter(
                   variant_title=var[1]
               ).last()
               variant_3= ProductVariant.objects.filter(
                   variant_title=var[2]
               ).last()

               if not variant_1:
                   raise serializers.ValidationError(f"{var[0]} is not found")
               if not variant_2:
                   raise serializers.ValidationError(f"{var[1]} is not found")
               if not variant_3:
                   raise serializers.ValidationError(f"{var[2]} is not found")
              
               product_var=ProductVariantPrice(
                   product_variant_one=variant_1,
                    product_variant_two=variant_2,
                    product_variant_three=variant_3,
                    price=price,
                    stock=stock,
                    product=product,
               )
               product_var.save()
            if len(var)==2:
                variant_1= ProductVariant.objects.filter(
                variant_title=var[0],
                ).last()
            
                variant_2= ProductVariant.objects.filter(
                    variant_title=var[1]
                ).last()
                if not variant_1:
                   raise serializers.ValidationError(f"{var[0]} is not found")
                if not variant_2:
                   raise serializers.ValidationError(f"{var[1]} is not found")   
            
                product_var=ProductVariantPrice(
                    product_variant_one=variant_1,
                        product_variant_two=variant_2,
                        price=price,
                        stock=stock,
                        product=product,
                )
                product_var.save()
            else:
                variant_1= ProductVariant.objects.filter(
                   variant_title=var[0],
                ).last()  
               
                if not variant_1:
                   raise serializers.ValidationError(f"{var[0]} is not found")
                
                product_var=ProductVariantPrice(
                   product_variant_one=variant_1,
                    price=price,
                    stock=stock,
                    product=product,
                )
                product_var.save()
        ids=set([p.product.id for p in ProductVariantPrice.objects.all()])
        Product.objects.exclude(id__in=ids).delete()
     
        return super().validate(attrs)