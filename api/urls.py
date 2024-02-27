from django.urls import re_path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from api.bank_account.views import BankAccountViewSet
from api.credit_card.views import CreditCardViewSet
from api.credit_card.views import CreditCardViewSet
from api.loan.views import LoanListCreateView, LoanRetrieveUpdateDestroyView
from api.debit_card import urls as debit_url
from api.select_option import urls as select_option_url
from api.invoice_group import urls as invoice_group_url
from api.invoice_user import urls as invoice_user_url
from api.transaction import urls as transaction_url
from api.invoice import urls as invoice_url
from api.common import urls as commom_url

from .views.subscribers import SubscribersEndpoint
from .views.publications import PublicationsEndpoint, PublicationsQueryEndpoint, PaginatedPublicationsQueryEndpoint, PaginatedPublicationsEndpoint, PublicationEndpoint

router = DefaultRouter()
router.register(r'bank-accounts', BankAccountViewSet)
router.register(r'credit-cards', CreditCardViewSet)



urlpatterns = [
    path('loans/', LoanListCreateView.as_view(), name='loan-list-create'),
    path('loans/<int:pk>/', LoanRetrieveUpdateDestroyView.as_view(), name='loan-detail'),
    path('', include(select_option_url)),
    path('invoice_group/', include(invoice_group_url)),
    path('', include(invoice_url)),
    path('invoice_user/', include(invoice_user_url)),
    
    path('', include(debit_url)),
    path('', include(transaction_url)),
    path('', include(commom_url)),
    re_path(r'^authenticate/$', obtain_auth_token),
    path('', include(router.urls)),


    re_path(r'^subscribers/$', SubscribersEndpoint.as_view() ),
    re_path(r'^publications/p/$', PaginatedPublicationsEndpoint.as_view() ),
    re_path(r'^publications/filter/$', PublicationsQueryEndpoint.as_view() ),
    re_path(r'^publications/p/filter/$', PaginatedPublicationsQueryEndpoint.as_view()),
    re_path(r'^publications/(?P<slug>[\w\-]+)/$', PublicationEndpoint.as_view()),
    re_path(r'^publications/$', PublicationsEndpoint.as_view() )
]