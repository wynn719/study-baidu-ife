define(['backbone', 'collections/categorys', 'views/category_list', 'views/task_list', 'views/task_detail', 'routers/default'], function(Backbone, CategoryCollection, CategorysView, TasksView, TaskDetail, AppRouter) {
    var App = function(options) {};
    App.prototype.dataBuild = function () {
        // 无记录，默认分类初始化
        if (!window.localStorage['Category-data']) {
            var model = {
                name: '默认文件夹',
                is_default: 1
            };
            CategoryCollection.create(model);
            // 测试数据
            var check = {
                name: 'hehe'
            };
            // for(var i = 0, length1 = 100; i < length1; i++){
            //     CategoryCollection.create(check);
            // }
        }
    };
    App.prototype.start = function() {
        this.dataBuild();

        var categorysView = new CategorysView();
        var tasksView = new TasksView();
        var taskDetail = new TaskDetail();

        // 全局路由监听
        window.appRouter = new AppRouter();
        Backbone.history.start();
    };

    return App;
});