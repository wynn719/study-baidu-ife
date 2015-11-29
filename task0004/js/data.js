// 模拟数据库的数据模式
var categorys = [
                    {
                        "name" : "默认分类",
                        "has_subcate" : 2,
                        "has_task" : 1,
                        "tasks_len" : 3
                    }
                ];
var sub_categorys = [
                        {
                            "name" : "小分类",
                            "cate" : 0,
                            "tasks_len" : 0
                        },
                        {
                            "name" : "小分类",
                            "cate" : 0,
                            "tasks_len" : 2
                        }
                    ];
var tasks = [
                {
                    "name" : "任务1",
                    "time" : "2015-10-04",
                    "content" : "这是任务一的内容",
                    "cate" : 0,
                    "sub_cate" : 1,
                    "is_finished" : false
                },
                {
                    "name" : "任务2",
                    "time" : "2015-10-08",
                    "content" : "这是任务一的内容",
                    "cate" : 0,
                    "sub_cate" : 1,
                    "is_finished" : false
                },
                {
                    "name" : "任务2",
                    "time" : "2015-10-01",
                    "content" : "这是任务一的容",
                    "cate" : 0,
                    "sub_cate" : false,
                    "is_finished" : false
                }
            ];
var data = {
    "cate" : categorys,
    "sub_cate" : sub_categorys,
    "tasks" : tasks
};

// 单一数据模式
/*var data = [
    {
        "name" : "默认分类",
        "sub_cate" : [
            {
                "name" : "小分类",
                "tasks" : []
            },
            {
                "name" : "小分类",
                "tasks" : [
                    {
                        "name" : "任务2",
                        "time" : "2015-10-04",
                        "content" : "这是任务一的内容",
                        "is_finished" : false
                    },

                    {
                        "name" : "任务2",
                        "time" : "2015-10-04",
                        "content" : "这是任务一的内容",
                        "is_finished" : false
                    }
                ]
            }
        ],
        "tasks" : [
            {
                "name" : "任务1",
                "time" : "2015-10-04",
                "content" : "这是任务一的内容",
                "is_finished" : false
            }
        ],
    }
];*/

// localStorage.data = JSON.stringify(data);
// alert($.type.isArray(JSON.parse(localStorage.data)));
// console.log(JSON.parse(localStorage.data));