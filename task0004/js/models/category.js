define(['backbone', 'underscore'], function(Backbone, _) {
    var Category = Backbone.Model.extend({
        // 当model被创建时默认的赋值
        defaults: {
            name: '新建分类',
            created: new Date(),
            tasks_count: 0,
            is_default: 0
        },

        // 初始化
        initialize: function() {
            // 为model绑定name属性变更事件，变更完触发callback
            // this.on('change', function(){}) 监听所有事件
            this.on('change', function(model) {
                var name = model.get('name');
            });
        },

        updateSubcateCount: function(type) {
            var count = parseInt(this.get('tasks_count'));
            if (type === 'add') {
                count++;
            } else {
                count--;
            }

            this.set({
                'tasks_count': count
            });
        }
    });

    return Category;
});