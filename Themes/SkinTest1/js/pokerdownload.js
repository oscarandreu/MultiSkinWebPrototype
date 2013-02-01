$(function() {

    // Set up variables
    var $el, $parentWrap, $otherWrap, 
        $allTitles = $("dt").css({
            padding: 5, // setting the padding here prevents a weird situation, where it would start animating at 0 padding instead of 5
            "cursor": "pointer" // make it seem clickable
        }),
        $allCells = $("dd").css({
            position: "relative",
            top: 0,
            left: 0,
			width: 408,
            display: "none" // info cells are just kicked off the page with CSS (for accessibility)
        });
    
    // clicking image of inactive column just opens column, doesn't go to link   
    $("#page-wrap").delegate("a.image","click", function(e) { 
        
        if ( !$(this).parent().hasClass("curCol") ) {         
            e.preventDefault(); 
            $(this).next().find('dt:first').click(); 
        } 
        
    });
    
    // clicking on titles does stuff
    $("#page-wrap").delegate("dt", "click", function() {
        
        // cache this, as always, is good form
        $el = $(this);
        
        // if this is already the active cell, don't do anything
        if (!$el.hasClass("current")) {
        
            $parentWrap = $el.parent().parent();
            $otherWraps = $(".info-col").not($parentWrap);
            
            // remove current cell from selection of all cells
            $allTitles = $("dt").not(this);
            
            // close all info cells
            $allCells.slideUp();
            
            // return all titles (except current one) to normal size
            $allTitles.animate({
                "font-size": "14px",
                paddingTop: 5,
                paddingRight: 5,
                paddingBottom: 5,
                paddingLeft: 5
            });
            
            // animate current title to larger size            
            $el.animate({
                "font-size": "25px",
                paddingTop: 10,
                paddingRight: 5,
                paddingBottom: 10,
                paddingLeft: 10
            }).next().slideDown();
            
            // make the current column the large size
            $parentWrap.animate({
                width: 410,
				paddingTop:10
            }).addClass("curCol");
            
            // make other columns the small size
            $otherWraps.animate({
                width: 140,
				paddingTop:70
            }).removeClass("curCol");
            
            // make sure the correct column is current
            $allTitles.removeClass("current");
            $el.addClass("current");  
						
						
			$("div.info-col a.image").stop().animate().css({
			"background-position": "center -70px",
			//"border": "1px solid #111111",
			//"box-shadow": "inset 0 0 31px black,0 0 5px black,0 0 15px black",
			"height": +100
            })
			
			$("div.info-col.curCol a.image").stop().animate().css({
			backgroundPosition: '0px -250px',
			//"border": "1px solid #FF9B62",
			//"box-shadow": "inset 0 0 31px black,0 0 52px #884100,0 0 80px #882100,0 0 150px #880500",
			"height": +250
            })
        
        }
        
    });
    
    $("#starter").trigger("click");
    
});