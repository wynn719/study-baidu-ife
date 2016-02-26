define(["backbone","jquery","underscore","routers/default","collections/tasks","views/task","collections/categorys","common","zeptoTouch"],function(t,e,i,n,s,o,a,c){var l=t.View.extend({initialize:function(){this.collection=s,this.cateCollection=a,this.$newTaskInput=this.$("#new-task-input"),this.$okBtn=this.$(".ok-btn"),this.$ulContainer=this.$("ul"),this.listenTo(this.collection,"add",this.addOne),this.listenTo(this.collection,"reset",this.addAll),this.listenTo(this.collection,"all",this.render),this.listenTo(this.collection,"add_task_invalid",this.addTaskInvalid),this.listenTo(n,"route:category",this.showTasksByCateId),this.listenTo(this.collection,"init",this.showTasksByCateId),this.collection.fetch()},render:function(t){},el:e("#task-list-view"),events:c.is_phone()?{swipeRight:"goBack","tap .ok-btn":"addOneTask","tap .back-btn":"goBack","tap .refresh-btn":"refreshPage"}:{"click .ok-btn":"addOneTask","click .back-btn":"goBack","click .refresh-btn":"refreshPage"},addOne:function(t){var e=new o({model:t});this.$ulContainer.append(e.render().el)},addAll:function(){this.collection.each(this.addOne,this)},addOneTask:function(){var t=this.$newTaskInput.val(),e=this.currentCateId;this.collection.create({name:t,cate:e}),this.$newTaskInput.val(""),this.collection.trigger("increase",e)},resetView:function(){this.$ulContainer.html("")},showTasksByCateId:function(t){this.currentCateId=t,this.collection.each(function(e){e.trigger("visible",t)},this)},goBack:function(t){t.preventDefault(),window.appRouter.navigate("",!0)},refreshPage:function(t){t.preventDefault(),window.location.reload(!1)},addTaskInvalid:function(t,e){t.destroy(),alert(e)}});return l});