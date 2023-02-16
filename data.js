const datas = [];

const first = '杨董孟倪陈冉赵边王张李肖朱平秦杜褚韩史高冯';
const second = '一二三四五六七八九十';
const third = '男女';

// 杨一一  赵二三 
const fn1 = (a,b)=>{ return Math.floor(Math.random()*(b-a+1)+a)};

// console.log(fn1(50,100))
for(let i=0;i<1688;i++){
    datas.push(
        {
            id:i+1,
            name:first[fn1(0,first.length-1)]+second[fn1(0,second.length-1)]+second[fn1(0,third.length-1)],  
            gender:third[fn1(0,third.length-1)],
            age:fn1(18,31),
            score:fn1(50,100),
            classroom:fn1(2301,2399),
        }
    )

}
// console.log(datas)