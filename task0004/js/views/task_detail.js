define(['backbone', 'jquery', 'collections/tasks'], function(Backbone, $, TaskCollection) {

    // 任务详情
    var TaskDetailView = Backbone.View.extend({
        initialize: function() {
            this.taskCollection = TaskCollection;

            this.$title = this.$('.app-title');
            this.$editTitle = this.$('.edit-title');
            this.$datetime = this.$('.task-datetime');
            this.$editContent = this.$('#edit-content');

            this.listenTo(window.appRouter, 'route:task', this.render);

            this.listenTo(this.taskCollection, 'task_init', this.render);
        },

        el: $('#task-view'),

        events: {
            'click .app-title': 'editTitle',
            'blur .edit-title': 'updateTaskTitle',
            'blur #edit-content': 'updateTaskContent',
            'click .back-btn': 'goBack'
        },

        render: function(taskId) {
            var task = this.taskCollection.findWhere({
                id: taskId
            });
            this.model = task;
            var data = {
                title: task.get('name'),
                created: task.get('created').substr(0, 10),
                content: task.get('content'),
                cate: task.get('cate'),
                isFinished: task.get('is_finished')
            };

            this.$title.text(data.title);
            this.$editTitle.val(data.title);
            this.$datetime.text(data.created);
            this.$editContent.text(data.content);
        },

        editTitle: function(e) {
            this.toggleTitleEdit();
            this.$editTitle.focus();
        },

        toggleTitleEdit: function() {
            this.$title.toggleClass('hide');
            this.$editTitle.toggleClass('hide');

        },

        updateTaskTitle: function(e) {
            var title = this.$editTitle.val();
            this.$title.text(title);
            this.model.set({
                name: title
            });
            this.model.save();

            this.toggleTitleEdit();
        },

        updateTaskContent: function(e) {
            var content = this.$editContent.val();
            this.$editContent.val(content);
            this.model.set({
                content: content
            });
            this.model.save();
        },

        goBack: function (e) {
            e.preventDefault();
            window.history.back();
        }
    });

    return TaskDetailView;
});