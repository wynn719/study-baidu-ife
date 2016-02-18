define(['backbone', 'underscore'], function(Backbone, _) {
    var Category = Backbone.Model.extend({
        // 当model被创建时默认的赋值
        defaults: {
            name: '新建分类',
            created: new Date(),
            tasks_count: 0,
            is_default: 0
        },

        validate: function(attrs, options) {
            var error = '';
            if (attrs['name'].trim() == '') {
                return '目录名不能为空';
            }
        },

        // 初始化
        initialize: function() {
            this.on('invalid', function(model, error) {
                this.trigger('add_category_invalid', model, error);
            });
        },

        updateSubcateCount: function(type) {
            var count = parseInt(this.get('tasks_count'));
            if (type === 'add') {
                count++;
            } else {
                count--;
            }

            this.save({
                'tasks_count': count
            });
        }
    });

    return Category;
});