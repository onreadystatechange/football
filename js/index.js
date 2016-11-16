$(function(){
    var index = {
        scroll1: null,
        scroll2: null,
        scroll3: null,
        swiper: null,
        $tabs: $("#tabs"),
        currIdx: 0,
        init: function(){
            this.bindEvent();
            this.initScroll();
            this.initSwiper();
            this.loadData();
        },
        bindEvent: function(){
            var _this = this;
            //����¼�
            _this.$tabs.on("tap", ".tab", function(){
                var currIdx = $(this).index();
                _this.swiper.slideTo(currIdx, 100, true);
            })
        },
        initScroll: function(){
            this.scroll1 = new IScroll("#scroll1");
            this.scroll2 = new IScroll("#scroll2");
            this.scroll3 = new IScroll("#scroll3");
        },
        initSwiper: function(){
            var _this = this;
            _this.swiper = new Swiper("#box", {
                direction: "horizontal",
                onSliderMove: function(s, e){
                    //console.log(s);
                },
                onSlideChangeStart: function(sw){
                    var currIdx = sw.activeIndex,
                        $currTab = _this.$tabs.children(".tab").eq(currIdx);

                    $currTab.addClass("active").siblings(".active").removeClass("active");
                    $("#slider").css("left", $currTab[0].offsetLeft);

                    _this.currIdx = currIdx;
                    //�仯��ǰ������
                    //�������
                    _this.loadData();
                }
            })
        },
        loadData: function(){
            var _this = this;
            $.ajax({
                url: "http://datainfo.duapp.com/shopdata/getGoods.php?callback=?",
                data: { classID: parseInt(_this.currIdx) + 1 },
                //classID��ʾ���Ǽ��ص�������
                //1. ��ʾ�����ֳ�
                //2. ��ʾ�������
                //3. ��ʾ������Ů
                dataType: "jsonp",
                success: function(d){
                    if(d == 0){
                        //���Ϊ�յĴ���
                    }else if(d != null){
                        if(_this.currIdx == 0){
                            var strHtml = "",
                                len = d.length;
                            for(var i = 0; i < len; i++){
                                strHtml += '<figure>'
                                    + '<a href="javascript:;"><img alt="' + d[i].goodsName + '" title="' + d[i].goodsName + '��" src="' + d[i].goodsListImg + '" /></a>'
                                    + '<figcaption><a href="javascript:;">' + d[i].goodsName + '</a></figcaption>'
                                    + '</figure>';
                            }
                            $("#scroll1").find(".list").html(strHtml);
                            _this.scroll1.refresh();
                        }
                        else if(_this.currIdx == 1){
                            //��ݹ̶����п?�Լ����ڵĿ�ȣ�ȥ��������

                            var len = d.length, //��ݵ�����
                                colWidth = 100, //�̶����п�
                                gap = 10,
                                winWidth = $(document).width(), //���ڵĿ��
                                col = Math.floor(winWidth / colWidth), //����ʾ������
                                $cols = null,
                                calMinHeight = function(){
                                    var minCol = $cols.eq(0),
                                        minHeight = minCol.height();
                                    for(var i = 0; i < col; i++){
                                        if($cols.eq(i).height() < minHeight){
                                            minHeight = $cols.eq(i).height();
                                            minCol = $cols.eq(i);
                                        }
                                    }
                                    return minCol;
                                };
                            //��̬����������������Ϊcol��
                            for(var i = 0; i < col; i++){
                                $("#scroll2 .wrapper").append('<div class="list"></div>');
                            }
                            $cols = $("#scroll2").find(".list").width(colWidth);
                            //ѭ����ݣ���ͼƬ��Ԥ����
                            //���ÿ��������ͼƬ�ļ���״̬������ʲôʱ����ҳ����������
                            var arrHtml = [],
                                arrImg = [];
                            for(var i = 0; i < len; i++){
                                var img = new Image();
                                img.src = d[i].goodsListImg; //Ԥ����
                                arrImg.push(img);

                                arrHtml.push('<figure>'
                                    + '<a href="javascript:;"><img alt="' + d[i].goodsName + '" title="' + d[i].goodsName + '��" src="' + d[i].goodsListImg + '" /></a>'
                                    + '<figcaption><a href="javascript:;">' + d[i].goodsName + '</a></figcaption>'
                                    + '</figure>');
                            }

                            var idx = 0;
                            $cols.eq(0).append(arrHtml[0]);

                            var intv = setInterval(function(){
                                if(arrImg[idx].complete || arrImg[idx].error){
                                    //���繲10����ݣ�idxΪ9ʱ�������������һ�����
                                    //��ʱ�����һ������Ѿ���ҳ�����ˣ�
                                    //���ң����һ��������ͼƬ�Ѿ��������
                                    //���ԣ�����Ҫ����ѭ����飬������ݵĹ�̾ͽ����ˡ�
                                    if(idx == (len - 1)){
                                        clearInterval(intv);
                                        _this.scroll2.refresh();
                                        return;
                                    }
                                    //�����cols���棬�ĸ��߶���С
                                    var $col = calMinHeight();
                                    $col.append(arrHtml[++idx]);
                                }
                            }, 20);
                        }
                        else if(_this.currIdx == 2){
                            var len = d.length, //��ݵ�����
                                colWidth = 100, //�̶����п�
                                winWidth = $(document).width(), //���ڵĿ��
                                col = Math.floor(winWidth / colWidth), //����ʾ������
                                gap = Math.floor((winWidth - col * colWidth) / (col - 1)),
                                arrHeight = new Array(col), //��¼ÿһ�еĸ߶�
                                arrLeft = new Array(col), //��¼ÿһ�е�left��ֵ
                                initCols = function(){
                                    for(var i = 0; i < col; i++){
                                        arrHeight[i] = 0;
                                        arrLeft[i] = (colWidth + gap) * i;
                                    }
                                },
                                calMinIdxByVal = function(arr, val){
                                    var minIdx = 0;
                                    arr.forEach(function(item, i, arr){
                                        if(item == val){
                                            minIdx = i;
                                        }
                                    })
                                    return minIdx;
                                };
                            initCols();

                            var arrHtml = [],
                                arrImg = [];
                            for(var i = 0; i < len; i++){
                                var img = new Image();
                                img.src = d[i].goodsListImg; //Ԥ����
                                arrImg.push(img);

                                arrHtml.push('<figure>'
                                    + '<a href="javascript:;"><img alt="' + d[i].goodsName + '" title="' + d[i].goodsName + '��" src="' + d[i].goodsListImg + '" /></a>'
                                    + '<figcaption><a href="javascript:;">' + d[i].goodsName + '</a></figcaption>'
                                    + '</figure>');
                            }

                            var idx = 0,
                                lastIdx = 0, //��ǰHTML�ṹ��ŵ���
                                lastItem = $(arrHtml[0]).appendTo("#scroll3 .list").css({
                                    left: arrLeft[0],
                                    top: arrHeight[0] + gap,
                                    width: colWidth
                                });
                                console.log(lastItem)
                            var intv = setInterval(function(){
                                if(arrImg[idx].complete || arrImg[idx].error){
                                    arrHeight[lastIdx] += (lastItem.height() + gap);
                                    if(idx == (len - 1)){
                                        clearInterval(intv);
                                        $("#scroll3 .list").height(Math.max.apply(null, arrHeight));
                                        _this.scroll3.refresh();
                                        return;
                                    }


                                    //������������һ�и߶���С
                                    var minHeight = Math.min.apply(null, arrHeight); //[100, 200, 50]
                                    lastIdx = calMinIdxByVal(arrHeight, minHeight);

                                    lastItem = $(arrHtml[++idx]).appendTo("#scroll3 .list").css({
                                        left: arrLeft[lastIdx],
                                        top: arrHeight[lastIdx] + gap,
                                        width: colWidth
                                    });
                                }
                            }, 20);

                        }
                    }
                }
            })
        }
    }
    index.init();
});