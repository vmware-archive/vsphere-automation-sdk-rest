$(function() {
    $(".expandable-container").each(function() {
        var slideHeight = 35;
        var $this = $(this);
        var $wrap = $this.children(".wrap");
        var defHeight = $wrap.height();
        if (defHeight >= slideHeight) {
            var $readMore = $this.find(".read-more");
            $wrap.css("height", slideHeight + "px");
            $readMore.append("<a href='#'>read more</a>");
            $readMore.children("a").bind("click", function(event) {
                var curHeight = $wrap.height();
                if (curHeight == slideHeight) {
                    $wrap.animate({
                        height : defHeight
                    }, "normal");
                    $(this).text("close");
                    $wrap.children(".gradient").fadeOut(); // if any
                } else {
                    $wrap.animate({
                        height : slideHeight
                    }, "normal");
                    $(this).text("read more");
                    $wrap.children(".gradient").fadeIn(); // if any
                }
                return false;
            });
        }
    });
});

function showFields() {
    document.getElementById( "statusCode" ).className = '';
    document.getElementById( "fields1" ).className = '';
    document.getElementById( "fields2" ).className = 'hidden';
}
function showLegacyFields() {
    document.getElementById( "fields2" ).className = '';
    document.getElementById( "fields1" ).className = 'hidden';
    document.getElementById( "statusCode" ).className = 'hidden';
}