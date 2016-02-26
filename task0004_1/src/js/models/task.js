define(['backbone', 'underscore'], function(Backbone, _) {

    var Task = Backbone.Model.extend({
        defaults: function() {
            return {
                name: '新建任务',
                created: new Date(),
                content: '',
                cate: 0,
                is_finished: false
            }
        },

        validate: function(attrs, options) {
            var error = '';
            if (attrs['name'].trim() == '') {
                return '任务名不能为空';
            }
        },

        initialize: function() {
            this.on('invalid', function(model, error) {
                if (model.id) { //修改
                    this.trigger('update_task_invalid', model, error);
                } else {
                    this.trigger('add_task_invalid', model, error);
                }
            });
        },

        toggle: function() {
            var is_finished = this.get('is_finished');
            this.save({
                'is_finished': !is_finished
            });
        }
    });

    return Task;

});