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

        initialize: function() {
            
        },

        toggle: function() {
            var is_finished = this.get('is_finished');
            this.set({
                'is_finished': !is_finished
            });
            this.save();
        }
    });

    return Task;

});