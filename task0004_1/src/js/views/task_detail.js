define(['backbone', 'jquery', 'collections/tasks', 'common', 'zeptoTouch'], function(Backbone, $, TaskCollection, Common) {

    // 任务详情
    var TaskDetailView = Backbone.View.extend({
        initialize: function() {
            this.taskCollection = TaskCollection;

            this.$title = this.$('.app-title');
            this.$editTitle = this.$('.edit-title');
            this.$datetime = this.$('.task-datetime');
            this.$editContent = this.$('#edit-content');

            this.data = {};

            this.listenTo(window.appRouter, 'route:task', this.render);

            this.listenTo(this.taskCollection, 'task_init', this.render);
            this.listenTo(this.taskCollection, 'update_task_invalid', this.taskInvalid);
        },

        el: $('#task-view'),

        events: Common.is_phone() ? {
            'swipeRight': 'goBack',
            'tap .app-title': 'editTitle',
            'blur .edit-title': 'updateTaskTitle',
            'blur #edit-content': 'updateTaskContent',
            'tap .back-btn': 'goBack',
            'tap .refresh-btn': 'refreshPage'
        } : {
            'click .app-title': 'editTitle',
            'blur .edit-title': 'updateTaskTitle',
            'blur #edit-content': 'updateTaskContent',
            'click .back-btn': 'goBack',
            'click .refresh-btn': 'refreshPage'
        },

        render: function(taskId) {
            var task = this.taskCollection.findWhere({
                id: taskId
            });
            this.model = task;
            this.data = {
                title: task.get('name'),
                created: task.get('created').substr(0, 10),
                content: task.get('content'),
                cate: task.get('cate'),
                isFinished: task.get('is_finished')
            };

            this.$title.text(this.data.title);
            this.$editTitle.val(this.data.title);
            this.$datetime.text(this.data.created);
            this.$editContent.val(this.data.content);
        },

        editTitle: function(event) {
            this.toggleTitleEdit();
            this.$editTitle.focus();
        },

        toggleTitleEdit: function() {
            this.$title.toggleClass('hide');
            this.$editTitle.toggleClass('hide');

        },

        updateTaskTitle: function(event) {
            var title = this.$editTitle.val();

            this.$title.text(title);
            this.model.save({
                name: title
            });

            this.toggleTitleEdit();
        },

        updateTaskContent: function(event) {
            var content = this.$editContent.val();
            this.model.save({
                content: content
            });
        },

        goBack: function (event) {
            event.preventDefault();
            window.history.back();
        },

        refreshPage: function (event) {
            event.preventDefault();
            window.location.reload(false);
        },

        taskInvalid: function (model, error) {
            this.$title.text(this.data.title);
            this.$editTitle.val(this.data.title);
            alert(error);
        }
    });

    return TaskDetailView;
});