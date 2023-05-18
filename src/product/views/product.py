from django.views import generic
from django.views import View 
from django.shortcuts import render
from product.models import Variant,Product,ProductVariant,ProductVariantPrice
from django.core.paginator import Paginator
from django.db.models  import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from product.serializers import ProductSerializer
from rest_framework import status 
class CreateProductView(generic.TemplateView):
    template_name = 'products/create.html'

    def get_context_data(self, **kwargs):
        context = super(CreateProductView, self).get_context_data(**kwargs)
        variants = Variant.objects.filter(active=True).values('id', 'title')
        context['product'] = True
        context['variants'] = list(variants.all())
        return context

class ProductListView(View):
    def get(self,request):
        page_size=2
        page=int(request.GET.get("page",1))

        title=request.GET.get("title")
        variant=request.GET.get("variant")
        price_from=request.GET.get("price_from")
        price_to=request.GET.get("price_to")
        date=request.GET.get("date") 
        total_count=Product.objects.all().count()
      
        if title or variant or price_from or price_to or date:
            if not price_from:
                price_from=0
            if not price_to:  
                mx_price=ProductVariantPrice.objects.all().order_by("-price")[0]
                price_to=mx_price.price 
            if date:
                products=Product.objects.filter(
                    title__icontains=title,
                    product_variant__variant_title__icontains=variant,
                    product__price__gte=price_from,
                    product__price__lte=price_to,
                    created_at__date=date).distinct()
                show_item_count=products.count() 
                if products.count()>0:
                    count=products.count()
                else:
                    count=1
                paginator = Paginator(products,count)
                products = paginator.get_page(1)

            else:
                products=Product.objects.filter(
                    title__icontains=title,
                     product_variant__variant_title__icontains=variant,
                    product__price__gte=price_from,
                    product__price__lte=price_to).distinct()
              
                show_item_count=products.count() 
                if products.count()>0:
                    count=products.count()
                else:
                    count=1
                paginator = Paginator(products,count)
                products = paginator.get_page(1)
        else:
            products=Product.objects.all().order_by("-id")
            paginator = Paginator(products,page_size)
            products = paginator.get_page(page)
            show_item_count=int(page_size*page)
        varients=ProductVariant.objects.values("variant_title").distinct()

      
        context={
            "products":products,
            "varients":varients,
            "total_count":total_count,
            "show_items_count":show_item_count
        }
        return render(request,"products/list.html",context)



class CreateProductAPIView(APIView):
    def post(self,request,format=None):
        serializer=ProductSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"msg":"product has been successfully created"},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)