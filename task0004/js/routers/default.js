define(['backbone', 'jquery', 'collections/categorys', 'collections/tasks'], function (Backbone, $, CategoryCollection, TaskCollection) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'category_:id': 'category',
            'task_:id': 'task'
        }, 

        initialize: function() {
            this.index();
        },

        index: function() {
            $('.app-view').addClass('hide');
            $('#category-view').removeClass('hide');
        },

        category: function(id) {
            TaskCollection.trigger('init', id);
            $('.app-view').addClass('hide');
            $('#task-list-view').removeClass('hide');
        },

        task: function(id) {
            TaskCollection.trigger('task_init', id);
            $('.app-view').addClass('hide');
            $('#task-view').removeClass('hide');
        }
    });

    return AppRouter;
});