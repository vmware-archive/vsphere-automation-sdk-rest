/* **********************************************************
 * Copyright 2016 VMware, Inc. All rights reserved. -- VMware Confidential
 * *********************************************************/

    //different node types
    var menu_active_class = "active";
    var menu_leaf_class = "leaf";
    var menu_open_class = "open";
    var menu_closed_class = "closed";

    //the default page that is displayed if URL ends in /
    var menu_default_page = "index.html";
    var has_children_node = 1;
    var contains_active_node = 2;
    var is_active_node = 4;

    //main function
    //menu_id : id of the element containing the navigation
    function menu_main(menu_id) {
        var url = location.href;
        if (url.lastIndexOf("/") == (url.length-1)) {
            url = url+menu_default_page;
        }
        if (url.lastIndexOf("?") >= 0) {
            url = url.substring(0, url.lastIndexOf("?"));
        }

        var main = document.getElementById(menu_id);
        if (!main) alert("No element with id '"+ menu_id +"' found");
        menu_traverse(main, url);
    }

    /* Goes down the subtree recursively
       and sets class depending on the calculated properties.
       has_children_node: set = element is a node, unset = element is a leaf
       contains_active_node: set = element contains the active node
       is_active_node: set = element is the active A node
    */
    function menu_traverse(element, url) {
        var props  = 0;

        // walk down
        for (var i=0; i<element.childNodes.length; i++) {
            var child = element.childNodes[i];
            // aggregate bits
            props |= menu_traverse(child, url);
        }

        // on the way back now
        switch (element.tagName) {
            case "UL":
                props |= has_children_node;
                break;

            case "LI":
                var c1 = (props & has_children_node) ?
                         ((props & (contains_active_node|is_active_node)) ? menu_open_class : menu_closed_class)
                         : menu_leaf_class;
                element.className = c1;
                if (props & is_active_node) {
                    if (!(props & contains_active_node)) element.className += " "+menu_active_class;
                    props |= contains_active_node;
                    props &= has_children_node | contains_active_node; // reset bit is_active_node
                }
                break;

            case "A":
                if (props & contains_active_node) break; // it is alreday marked that this node contains the active node
                var href = element.getAttribute("href");
                if (menu_isSameUrl(url, href)) {
                     props |= is_active_node;
                }
                break;
        }
        return props;
    }

    // matches two URIs when href is the last part of url
    function menu_isSameUrl(url, href) {
        var a = url.split(/[?\/]/i);
        var b = href.split(/[?\/]/i);
        var i = a.length - 1;
        var j = b.length - 1;
        while ((i >= 0) && (j >= 0)) {
            if (b[j] == "..") { j-=2; continue; }
            if (a[i] == "..") { i-=2; continue; }
            if ((b[j] == ".") || (b[j] == "")) { j--; continue; }
            if ((a[i] == ".") || (a[i] == "")) { i--; continue; }
            if (! (a[i] == b[j])) return false;
            i--;
            j--;
        }
        return true;
     }
