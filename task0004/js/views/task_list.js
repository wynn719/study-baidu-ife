define(['backbone', 'jquery', 'underscore', 'routers/default', 'collections/tasks', 'views/task', 'collections/categorys'], function (Backbone, $, _, AppRouter, TaskCollection, TaskView, CategoryCollection) {

    // 任务列表视图
    var TaskListView = Backbone.View.extend({
        initialize: function() {
            this.collection = TaskCollection;
            this.cateCollection = CategoryCollection;

            this.$newTaskInput = this.$('#new-task-input');
            this.$okBtn = this.$('.ok-btn');
            this.$ulContainer = this.$('ul');

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'all', this.render);

            this.listenTo(AppRouter, 'route:category', this.showTasksByCateId);

            this.listenTo(this.collection, 'init', this.showTasksByCateId);

            this.collection.fetch();
        },

        render: function (cate_id) {},

        el: $('#task-list-view'),

        events: {
            'click .ok-btn': 'addOneTask',
            'click .back-btn': 'goBack'
        },

        addOne: function(task) {
            var view = new TaskView({model: task});
            this.$ulContainer.append(view.render().el);
        },

        addAll: function() {
            console.log('all')
            this.collection.each(this.addOne, this);            
        },

        addOneTask: function() {
            var taskName = this.$newTaskInput.val();
            var cate_id = this.currentCateId;
            this.collection.create({
                name: taskName,
                cate: cate_id
            });
            this.$newTaskInput.val('');
        },

        resetView: function () {
            this.$ulContainer.html('');
            this.$newTaskInput.focus();
        },

        // 根据cate_id来决定显示的任务
        showTasksByCateId: function(cateId) {
            this.currentCateId = cateId;
            this.collection.each(function (task) {
                task.trigger('visible', cateId);
            }, this);
        },

        goBack: function (e) {
            e.preventDefault();
            window.appRouter.navigate('', true);
        }
    });

    return TaskListView;
});