import Backbone from 'backbone';
import Order from '../models/order'
import OrderView from '../views/order_view'
import OrderList from '../collections/order_list';
import _ from 'underscore';

const OrderListView = Backbone.View.extend({
  initialize(params){
    this.template = params.template;
    this.quotes = params.quotes;
    this.listenTo(this.model, "update", this.render);
  },

  render() {
    this.$('#orders').empty();
    this.model.each((order) => {
      const orderView = new OrderView({
        model: order,
        template: this.template,
        tagName: 'li',
        className: 'order'
      });
      this.$('#orders').append(orderView.render().$el);
    })
    return this
  },

  events: {
    'click button.btn-buy': 'buyOrder',
    'click button.btn-sell': 'sellOrder',
    'click button.btn-cancel': 'cancelOrder'
  },

  buyOrder(e){
    e.preventDefault();
    this.appendOrder(true);
  },

  sellOrder(e) {
    e.preventDefault();
    this.appendOrder(false)
  },

  appendOrder(isBuy) {
    this.$('.form-errors').empty();
    let orderData = {
      buy: isBuy
    }

    orderData.symbol = this.$(`[name='symbol']`).val();
    orderData.targetPrice = parseFloat(this.$(`[name='price-target']`).val());
    orderData.quote = this.quotes.findWhere({symbol: orderData.symbol})

    const order = new Order(orderData);

    if (!order.invalid()) {
      this.model.add(order);
    } else {
      for (let errors in order.invalid()) {
        order.invalid()[errors].forEach((error) => {
          this.$('.form-errors').append(error)
        })
      }
    }
  },
})

export default OrderListView;
