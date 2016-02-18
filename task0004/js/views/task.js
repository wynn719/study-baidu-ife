define(['backbone', 'jquery', 'underscore', 'common', 'zeptoTouch'], function(Backbone, $, _, Common) {

    // 单个任务的视图
    var TaskView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.hideSelf);
        },

        tagName: 'li',
        className: 'task',

        template: _.template( $('#task_li').html() ),

        events: Common.is_phone() ? {
            'tap': 'openTask',
            'tap .delete-icon': 'clear',
            'tap .checkbox': 'toggleTaskState' 
        } : {
            'click': 'openTask',
            'click .delete-icon': 'clear',
            'click .checkbox': 'toggleTaskState' 
        },

        render: function() {
            this.$el.html( this.template(this.model.toJSON()) );
            this.$el.toggleClass('finished', this.model.get('is_finished'));
            return this;
        },

        clear: function(e) {
            e.preventDefault();
            this.model.destroy();
        },

        toggleTaskState: function(e) {
            e.preventDefault();
            if (e.target.className.indexOf('checkbox') === -1) 
                return false;

            this.model.toggle();
            this.$el.toggleClass('finished', this.model.get('is_finished'));
        },

        openTask: function(e) {
            e.preventDefault();
            if (e.target.className.indexOf('delete-icon') !== -1
                || e.target.className.indexOf('checkbox') !== -1
                || e.target.className.indexOf('sprite') !== -1
                || e.target.className.indexOf('checkbox-input') !== -1) 
                return false;

            window.appRouter.navigate('task_' + this.model.get('id'), true);
        },

        // 触发visible事件决定是否隐藏视图
        hideSelf: function (cateId) {
            if (this.model.get('cate') !== cateId) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        }
    });

    return TaskView;
})