import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    common: {
      back: '返回',
      confirm: '确认',
      cancel: '取消',
      submit: '提交'
    },
    dining: {
      tableNumber: '桌号',
      numberOfDiners: '就餐人数',
      selectDiners: '请选择就餐人数',
      people: '人',
      robotId: '机器人编号',
      staffOrder: '服务员点餐'
    },
    ordering: {
      menu: '菜单',
      cart: '购物车',
      search: '搜索',
      category: {
        all: '全部',
        baijiu: '白酒',
        redWine: '红酒',
        beer: '啤酒',
        foreign: '洋酒'
      },
      temperature: {
        cold: '冷饮',
        hot: '热饮',
        both: '冷热皆可'
      }
    },
    order: {
      confirmOrder: '确认订单',
      selectedItems: '已选商品',
      unitPrice: '单价',
      quantity: '数量',
      temperature: '温度',
      subtotal: '小计',
      totalItems: '商品总数',
      totalAmount: '订单总计',
      pieces: '件',
      orderSuccess: '下单成功',
      orderFailed: '下单失败',
      invalidTable: '无效的桌号',
      emptyCart: '购物车为空',
      addToCart: '加入购物车',
      addSuccess: '已加入购物车'
    },
    product: {
      category: '类别',
      alcoholContent: '酒精度',
      price: '价格',
      temperatureRequirement: '温度要求',
      description: '商品描述'
    },
    cart: {
      title: '购物车',
      empty: '购物车是空的',
      clearCart: '清空购物车',
      clearConfirm: '确认清空购物车?',
      clearSuccess: '购物车已清空',
      confirmTip: '提示',
      submitOrder: '提交订单',
      total: '合计'
    }
  },
  en: {
    common: {
      back: 'Back',
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Submit'
    },
    dining: {
      tableNumber: 'Table No.',
      numberOfDiners: 'Number of Diners',
      selectDiners: 'Please select number of diners',
      people: 'people',
      robotId: 'Robot ID',
      staffOrder: 'Staff Order'
    },
    ordering: {
      menu: 'Menu',
      cart: 'Cart',
      search: 'Search',
      category: {
        all: 'All',
        baijiu: 'Baijiu',
        redWine: 'Red Wine',
        beer: 'Beer',
        foreign: 'Foreign Wine'
      },
      temperature: {
        cold: 'Cold',
        hot: 'Hot',
        both: 'Both'
      }
    },
    order: {
      confirmOrder: 'Confirm Order',
      selectedItems: 'Selected Items',
      unitPrice: 'Unit Price',
      quantity: 'Quantity',
      temperature: 'Temperature',
      subtotal: 'Subtotal',
      totalItems: 'Total Items',
      totalAmount: 'Total Amount',
      pieces: 'pieces',
      orderSuccess: 'Order Placed Successfully',
      orderFailed: 'Failed to Place Order',
      invalidTable: 'Invalid Table Number',
      emptyCart: 'Cart is Empty',
      addToCart: 'Add to Cart',
      addSuccess: 'Added to Cart'
    },
    product: {
      category: 'Category',
      alcoholContent: 'Alcohol Content',
      price: 'Price',
      temperatureRequirement: 'Temperature',
      description: 'Description'
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Cart is empty',
      clearCart: 'Clear Cart',
      clearConfirm: 'Clear all items from cart?',
      clearSuccess: 'Cart cleared',
      confirmTip: 'Confirm',
      submitOrder: 'Submit Order',
      total: 'Total'
    }
  },
  ar: {
    common: {
      back: 'عودة',
      confirm: 'تأكيد',
      cancel: 'إلغاء',
      submit: 'إرسال'
    },
    dining: {
      tableNumber: 'رقم الطاولة',
      numberOfDiners: 'عدد الضيوف',
      selectDiners: 'الرجاء اختيار عدد الضيوف',
      people: 'أشخاص',
      robotId: 'معرف الروبوت',
      staffOrder: 'طلب الموظفين'
    },
    ordering: {
      menu: 'قائمة الطعام',
      cart: 'عربة التسوق',
      search: 'بحث',
      category: {
        all: 'الكل',
        baijiu: 'بايجيو',
        redWine: 'نبيذ أحمر',
        beer: 'بيرة',
        foreign: 'نبيذ أجنبي'
      },
      temperature: {
        cold: 'بارد',
        hot: 'ساخن',
        both: 'كلاهما'
      }
    },
    order: {
      confirmOrder: 'تأكيد الطلب',
      selectedItems: 'العناصر المختارة',
      unitPrice: 'سعر الوحدة',
      quantity: 'الكمية',
      temperature: 'درجة الحرارة',
      subtotal: 'المجموع الفرعي',
      totalItems: 'إجمالي العناصر',
      totalAmount: 'المبلغ الإجمالي',
      pieces: 'قطع',
      orderSuccess: 'تم تقديم الطلب بنجاح',
      orderFailed: 'فشل في تقديم الطلب',
      invalidTable: 'رقم طاولة غير صالح',
      emptyCart: 'السلة فارغة',
      addToCart: 'أضف إلى السلة',
      addSuccess: 'تمت الإضافة إلى السلة'
    },
    product: {
      category: 'الفئة',
      alcoholContent: 'نسبة الكحول',
      price: 'السعر',
      temperatureRequirement: 'درجة الحرارة',
      description: 'الوصف'
    },
    cart: {
      title: 'عربة التسوق',
      empty: 'السلة فارغة',
      clearCart: 'تفريغ السلة',
      clearConfirm: 'تأكيد تفريغ السلة؟',
      clearSuccess: 'تم تفريغ السلة',
      confirmTip: 'تنبيه',
      submitOrder: 'تقديم الطلب',
      total: 'المجموع'
    }
  }
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'zh',
  messages
})

export default i18n 