(function(win, $){
    
    var Category = Backbone.Model.extend({
        // 通过restful来与服务端做交互
        // urlRoot: '/user', 
        
        localStorage: new Backbone.LocalStorage("Category-data"),

        // 当model被创建时默认的赋值
        defaults: {
            name: '新建分类',
            has_subcate: 0
        },

        // 验证方法，绑定了invalid事件后会触发
        validate: function(attributes) {
            if (typeof attributes.name != 'string') {
                return "has_subcate should be a string";
            }
        },

        // 初始化
        initialize: function() {
            // console.log('create a new CategoryModel');

            // 为model绑定name属性变更事件，变更完触发callback
            // this.on('change', function(){}) 监听所有事件
            this.on('change:name', function(model) {
                var name = model.get('name');
                console.log('changed my name to ' + name);
            });

            // 为validate方法绑定验证，在save前时触发
            this.on('invalid', function(model, error) {
                console.log('error:' + error);
            });
        },

        // 自定义方法，默认public
        alterAttr: function(newName) {
            this.set({ name: newName });
        },

        increaseSubcate: function() {
            this.set({  })
        },

        addNewTask: function() {
            this.save({name: 'dddd'});
        }
    });

    // 一个model可以对应多个collection，一个collection不能对应多个model
    var CategoryList = Backbone.Collection.extend({
        // 指定collection对应的model
        model: Category
    });

    var categoryList = new CategoryList;

    var category = new Category();
    // console.log(category.toJSON());

    // category.alterAttr(123);

    // 通过restful操作保存到服务端
    category.save({name: 'hh', has_subcate: 0});
    

    var CategoryView = Backbone.View.extend({
        initialize: function() {

        },

        // el是view中的默认属性，如果不赋值，会是一个空的div
        // 指定view的dom元素容器，所有事件触发都会在这个元素中
        el: $('#category-view'),

        // _调用的是underscore的方法，template最后存在CDN上，这样用户就可以缓存它们
        template: _.template( $('#category_view').html()),

        // 将underscore对应生成的模板载入el元素中
        render: function() {
            this.$el.html( this.template({ cate_title : '吉他乐理' }) );
            return this;
        },

        // 管理该view的所有事件
        events: {
            // 绑定对应函数
            'click .task' : 'openCate'
        },

        openCate: function() {
            console.log('task cleck ');
        }
    });

    var cv = new CategoryView();
    cv.render();

    // route一个好的例子：http://demo.com/#/user/photos
    // route虽好，但不要滥用
    var AppRouter = Backbone.Router.extend({
        routes: {
            'posts/:id': 'getPost',
            '*actions': 'defaultRoute'
        },

        initialize: function() {
            // 绑定默认router
            this.on('route:defaultRoute', function(actions) {
                console.log(actions);
            });

            this.route('page/:number', 'page', function(number) {
                console.log(number);
            });
        }
    });

    var app_router = new AppRouter;
    app_router.on('route:getPost'), function(id) {
        console.log(id);
    };
    // 必要的步骤
    Backbone.history.start();
})(window, $);