(function(window, $) {

    var Task = Backbone.Model.extend({
        initialize: function() {

        },

        defaults: function() {
            return {
                name: 'task',
                order: Todos.nextOrder(),
                datetime: 'today',
                content: '暂无',
                done: false
            }
        },

        // 切换todo的状态
        toggle: function() {
            this.save({
                done: !this.get('done')
            });
        }
    });

    var TaskList = Backbone.Collection.extend({
        model: Task,

        localStorage: new Backbone.LocalStorage('todos-backbone'),

        done: function() {
            return this.where({
                done: true
            });
        },

        remaining: function() {
            return this.where({
                done: false
            });
        },

        nextOrder: function() {
            if (!this.length) {
                return 1;
            };

            return this.last().get('order') + 1;
        },

        comparator: 'order'
    });

    var Tasks = new TaskList;

    var TaskView = Backbone.View.extend({
        tagName: 'li',

        template: _.template($('#item-template').html()),

        events: {
            'click .toggle': 'toggleDone',
            'dblclick .view': 'edit',
            'click a.destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        }, 

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        }
    });

})(window, $);