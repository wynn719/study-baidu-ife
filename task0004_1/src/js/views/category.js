define(['backbone', 'jquery', 'underscore', 'routers/default', 'collections/tasks', 'common'], function(Backbone, $, _, appRouter, TaskCollection, Common) {

    // 单个目录视图
    var CategoryView = Backbone.View.extend({
        initialize: function() {
            this.tasksCollection = TaskCollection;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        // el是view中的默认属性，如果不赋值，会是一个空的div
        // 指定view的dom元素容器，所有事件触发都会在这个元素中
        // $el是jquery的缓存dom
        // el是指定的
        tagName: 'li',
        className: 'task',

        // _调用的是underscore的方法，template最后存在CDN上，这样用户就可以缓存它们
        template: _.template($('#category_li').html()),

        // 将underscore对应生成的模板载入el元素中
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        // 管理该view的所有事件
        events: Common.is_phone() ? {
            // 绑定对应函数
            'tap': 'openCate', // 不指定时，指向元素本身
            'tap .delete-icon': 'clear'
        } : {
            'click': 'openCate',
            'click .delete-icon': 'clear'
        },

        openCate: function(e) {
            e.preventDefault();
            if (e.target.className.indexOf('delete-icon') !== -1
                || e.target.className.indexOf('sprite') !== -1) 
                return false;

            window.appRouter.navigate("category_" + this.model.id, {
                trigger: true
            });
        },

        clear: function(e) {
            e.preventDefault();

            var ret = true;
            if (this.model.get('tasks_count')) {
                ret = confirm('该目录下有任务，是否删除?');
            }

            if (ret) { // 删除目录子任务
                var cateId = this.model.get('id');

                this.tasksCollection.each(function(task) {
                    if (task.get('cate') === cateId) {
                        task.destroy();
                    }
                });

                this.model.destroy();
            }
        }
    });

    return CategoryView;
})