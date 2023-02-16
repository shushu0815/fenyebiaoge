// 一共多少条数据
// 每页显示多少条数据
// 多少页 
// 当前页

// 属性 

// 一共多少条数据
// 每页显示多少条数据
// 多少页 
// 当前页

// 创建元素 
// 首页 上一页 按钮组  下一页 尾页 输入框 按钮
// 创建元素同时设定样式   

// 用户只需要写一个div 并且引入js文件 实例化对象 就可以达到目的

// 方法  
// 1. 调整参数   让用户传递数据 根据传递的数据进行改变及渲染 


// 什么时候渲染另一页数据 
//  把想做的事情放到一个函数中  如果点击事件触发  执行这个函数 

class Pagenation {
    constructor(selector, options = {}) {
        // 外围最大容器
        this.ele = document.querySelector(selector);

        // 默认值
        this.pageInfo = {
            current: 1,
            total: 90,
            pagesize: 10,

        }

        //等待创建的元素
        this.first = null; //首页
        this.prev = null; // 上一页
        this.next = null; // 下一页
        this.last = null; // 尾页
        this.inp = null; // 输入框
        this.btn = null; // 跳转按钮
        this.list = null; // 中间的按钮组  

        this.setOptions(options);
        this.setEleStyles()
        this.createEle();
        // this.bindList();
        this.bindHtml();
        this.bindEvent();
    }

    //如果用户传递了数据  就用用户传递的数据 
    // 如果没有传递  就用默认值
    setOptions(options) {
        // 当前第几页 
        this.pageInfo.current = options.current || 1;
        // 一页显示多少条 
        this.pageInfo.pagesize = options.pagesize || 10;
        // 一共多少页  总条数/每页显示多少条 算出来 
        //用户也可以传递多少页
        if (options.totalpage) { // 如果用户传递了多少页
            this.pageInfo.totalpage = options.totalpage;
        }
        else { // 如果没有传递多少页
            if (options.total) { // 如果传递了总条数
                this.pageInfo.totalpage = Math.ceil(options.total / this.pageInfo.pagesize);
            }
            else { // 如果没有传递总条数
                this.pageInfo.totalpage = 9;
            }
        }

        // 用户可以设定 按钮的名称  首页 或者 first 
        this.pageInfo.first = options.first || '首页';


        this.pageInfo.change = options.change || function () { };
    }

    // 不用用户写样式 
    // 我们就需要写个函数 动态的把样式加到元素中 

    setStyles(ele, styles) {
        for (let key in styles) {
            ele.style[key] = styles[key]
        }
    }
    setEleStyles() {
        this.setStyles(this.ele, {
            width: '1000px',
            height: '40px',
            border: '1px solid #333',
            margin: '50px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        })
    }
    // 创建元素
    // 首页 上一页 按钮组  下一页 尾页 输入框 按钮
    createEle() {

        //首页
        this.origin = document.createElement('p');
        this.setStyles(this.origin, {
            padding: '5px 10px',
            border: '1px solid #333',
            cursor: 'pointer',
            margin: '0 10px',
        })


        this.first = this.origin.cloneNode(true);
        this.first.innerText = this.pageInfo.first;
        this.first.name = 'first';
        this.ele.appendChild(this.first);

        this.prev = this.origin.cloneNode(true);
        this.prev.innerText = '上一页';
        this.prev.name = 'prev';
        this.ele.appendChild(this.prev);

        // 创建ul 
        this.list = document.createElement('ul');
        this.setStyles(this.list, {
            display: 'flex',
            padding: '0',
        })
        this.ele.appendChild(this.list);


        this.next = this.origin.cloneNode(true);
        this.next.innerText = '下一页';
        this.next.name = 'next';
        this.ele.appendChild(this.next);

        this.last = this.origin.cloneNode(true);
        this.last.innerText = '尾页';
        this.last.name = 'last';
        this.ele.appendChild(this.last);


        // 创建输入框
        this.inp = document.createElement('input');
        this.inp.value = this.pageInfo.current;
        this.setStyles(this.inp, {
            width: '50px',
            height: '30px',
            textAlign: 'center',
            outline: 'none',
            margin: '0 10px',
        })
        this.ele.appendChild(this.inp);


        // 创建按钮

        this.btn = document.createElement('button');
        this.btn.innerText = '跳转';
        this.btn.name = 'go';
        this.setStyles(this.btn, {
            height: '34px',
            width: '50px',
            cursor: 'pointer',
        })
        this.ele.appendChild(this.btn);


    }

    // 判断首页 上一页 下一页 尾页 是否可以点击
    // 用来接收总页数  当前页 
    bindHtml(){
        // 取出当前页 和 总页数  解构赋值
        const {current,totalpage} = this.pageInfo;
        // alert(totalpage);
        const disable = {  backgroundColor: '#ccc',cursor: 'not-allowed'}
        const enable = {  backgroundColor: '#fff',cursor: 'pointer'}
        // 判断当前页是否是第一页  如果是第一页  那么首页和上一页就不能点击
        if(current <=1){
            this.setStyles(this.first,disable)
            this.setStyles(this.prev,disable)
        }
        else{
            this.setStyles(this.first,enable)
            this.setStyles(this.prev,enable)
        }

        // 判断当前页是否是最后一页  如果是最后一页  那么下一页和尾页就不能点击
        if(current >= totalpage){
            
            
            this.setStyles(this.next,disable)
            this.setStyles(this.last,disable)
        }else{
            this.setStyles(this.next,enable)
            this.setStyles(this.last,enable)
        }
        this.inp.value = current;
        
        this.bindList(); //渲染的时候判断ul列表的显示情况 
        
        this.pageInfo.change(this.pageInfo.current);
    }

    bindList() {
        // alert(this.list);
        // 清空ul里面的内容
        this.list.innerHTML = ''; //每次加载之前先清空ul里面的内容
        const {pagesize,current,totalpage} = this.pageInfo;
        const origin = document.createElement('li');
        origin.dataset.name = 'item';
        this.setStyles(origin, {
            listStyle: 'none',
            border: '1px solid #333',
            padding: '5px 10px',
            margin: '0 5px',
            cursor: 'pointer',
        })

        // 9 页一下的情况 
        // 9页以上的情况
        // 当前页面小于5
        // 当前页面大于5
        // 当前页面等于5


        // 当前页面小于倒数第5
        // 当前页面大于倒数5页
        // 当前页面等于倒数第5页
        // 总页数
        // let totalpage = 20;
        // let current = 16;
        if (totalpage <= 9) {
            for (let i = 0; i < totalpage; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }
            return
        }
        
        if (current < 5) {
            // 左边5个 中间 ... 右边2个
            for (let i = 0; i < 5; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            var span = document.createElement('span');
            span.innerText = '...';
            this.list.appendChild(span);

            for (let i = totalpage - 2; i < totalpage; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            return
        }

        if (current == 5) {
            // 左边5个 中间 ... 右边2个
            for (let i = 0; i < 7; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            var span = document.createElement('span');
            span.innerText = '...';
            this.list.appendChild(span);

            for (let i = totalpage - 2; i < totalpage; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            return
        }

        // 当前页面 大于倒数第5页

        if (current > totalpage - 4) {
            // 左边5个 中间 ... 右边2个
            for (let i = 0; i < 2; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            var span = document.createElement('span');
            span.innerText = '...';
            this.list.appendChild(span);

            for (let i = totalpage - 5; i < totalpage; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            return
        }

        if (current == totalpage - 4) {
            // 左边5个 中间 ... 右边2个
            for (let i = 0; i < 2; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            var span = document.createElement('span');
            span.innerText = '...';
            this.list.appendChild(span);

            for (let i = totalpage - 7; i < totalpage; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            return
        }

        if (current == totalpage - 4) {
            // 左边5个 中间 ... 右边2个
            for (let i = 0; i < 2; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            var span = document.createElement('span');
            span.innerText = '...';
            this.list.appendChild(span);

            for (let i = totalpage - 7; i < totalpage; i++) {
                const li = origin.cloneNode(true);
                li.innerText = i + 1;
                if(i+1 === current){
                    this.setStyles(li,{ backgroundColor: 'orange',
                        color: '#fff'})
                }
                this.list.appendChild(li);
            }

            return
        }


        // 当前页面 大于5页 小于倒数第5页

        for (let i = 0; i < 2; i++) {
            const li = origin.cloneNode(true);
            li.innerText = i + 1;
            if(i+1 === current){
                this.setStyles(li,{ backgroundColor: 'orange',
                    color: '#fff'})
            }
            this.list.appendChild(li);
        }

        var span = document.createElement('span');
        span.innerText = '...';
        this.list.appendChild(span);

        for(let i=current-3;i<current+2;i++){
            const li = origin.cloneNode(true);
            li.innerText = i + 1;
            if(i+1 === current){
                this.setStyles(li,{ backgroundColor: 'orange',
                    color: '#fff'})
            }
            this.list.appendChild(li);
        }

        
        var span = document.createElement('span');
        span.innerText = '...';
        this.list.appendChild(span);    
        for (let i = totalpage-2; i < totalpage; i++) {
            const li = origin.cloneNode(true);
            li.innerText = i + 1;
            if(i+1 === current){
                this.setStyles(li,{ backgroundColor: 'orange',
                    color: '#fff'})
            }
            this.list.appendChild(li);
        }






    }


    bindEvent(){
        this.ele.addEventListener('click',e=>{
            if(e.target.name === 'first'){
                if(this.pageInfo.current === 1) return;
                this.pageInfo.current = 1;
                this.bindHtml(); //重新渲染
            }


            if(e.target.name === 'prev'){
                if(this.pageInfo.current === 1) return;
                this.pageInfo.current--;
                this.bindHtml();
            }



            if(e.target.name === 'next'){
                if(this.pageInfo.current === this.pageInfo.totalpage) return;
                this.pageInfo.current++;
                this.bindHtml();
            }


            if(e.target.name === 'last'){
                if(this.pageInfo.current === this.pageInfo.totalpage) return;
                this.pageInfo.current = this.pageInfo.totalpage;
                this.bindHtml();
            }

            if(e.target.name === 'go'){
                // 拿到你文本的内容
                let page = this.inp.value - 0;
                if(isNaN(page)){
                    page =1;
                }   
                if(page<=1){
                    page =1;
                }
                if(page>= this.pageInfo.totalpage){
                    page = this.pageInfo.totalpage;
                }

                this.pageInfo.current = page;
                this.bindHtml();
            }

            if(e.target.dataset.name === 'item'){
                this.pageInfo.current = e.target.innerText - 0;
                this.bindHtml();
            }
        })

    }


}