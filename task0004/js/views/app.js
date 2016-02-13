define(['backbone', 'collections/categorys', 'views/category_list', 'views/task_list', 'views/task_detail', 'routers/default'], function(Backbone, CategoryCollection, CategorysView, TasksView, TaskDetail, AppRouter) {
    var App = function(options) {};
    App.prototype.init = function() {
        // 无记录，默认分类初始化
        if (!window.localStorage['Category-data']) {
            var model = {
                name: '默认分类',
                created: new Date(),
                tasks_count: 0,
                is_default: 1
            };
            CategoryCollection.create(model);
        }

        var categorysView = new CategorysView();
        var tasksView = new TasksView();
        var taskDetail = new TaskDetail();

        // 全局路由监听
        window.appRouter = new AppRouter();
        Backbone.history.start();
    };

    return App;
});