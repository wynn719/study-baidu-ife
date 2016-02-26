define(['backbone', 'jquery', 'underscore', 'routers/default', 'collections/tasks', 'views/task', 'collections/categorys', 'common', 'zeptoTouch'], function (Backbone, $, _, AppRouter, TaskCollection, TaskView, CategoryCollection, Common) {

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
            this.listenTo(this.collection, 'add_task_invalid', this.addTaskInvalid);

            this.listenTo(AppRouter, 'route:category', this.showTasksByCateId);

            this.listenTo(this.collection, 'init', this.showTasksByCateId);

            this.collection.fetch();
        },

        render: function (cate_id) {},

        el: $('#task-list-view'),

        events: Common.is_phone() ? {
            'swipeRight': 'goBack',
            'tap .ok-btn': 'addOneTask',
            'tap .back-btn': 'goBack',
            'tap .refresh-btn': 'refreshPage'
        } : {
            'click .ok-btn': 'addOneTask',
            'click .back-btn': 'goBack',
            'click .refresh-btn': 'refreshPage'
        },

        addOne: function(task) {
            var view = new TaskView({model: task});
            this.$ulContainer.append(view.render().el);
        },

        addAll: function() {
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
            this.collection.trigger('increase', cate_id);
        },

        resetView: function () {
            this.$ulContainer.html('');
        },

        // 根据cate_id来决定显示的任务
        showTasksByCateId: function(cateId) {
            this.currentCateId = cateId;
            this.collection.each(function (task) {
                task.trigger('visible', cateId);
            }, this);
        },

        goBack: function (event) {
            event.preventDefault();
            window.appRouter.navigate('', true);
        },

        refreshPage: function (event) {
            event.preventDefault();
            window.location.reload(false);
        },

        addTaskInvalid: function (model, error) {
            model.destroy();
            alert(error);
        }
    });

    return TaskListView;
});