/*******************************************************************************
 * Switch Content script- � Dynamic Drive (www.dynamicdrive.com) This notice
 * must stay intact for legal use. Last updated April 2nd, 2005. Visit
 * http://www.dynamicdrive.com/ for full source code
 ******************************************************************************/

var enablepersist = "off" // Enable saving state of content structure using
							// session cookies? (on/off)
var collapseprevious = "yes" // Collapse previously open content when opening
								// present? (yes/no)

var contractsymbol = '- ' // HTML for contract symbol. For image, use: <img
							// src="whatever.gif">
var expandsymbol = '+ ' // HTML for expand symbol.

if (document.getElementById) {
	document.write('<style type="text/css">')
	document.write('.switchcontent{display:none;}')
	document.write('</style>')
}

function getElementbyClass(rootobj, classname) {
	var temparray = new Array()
	var inc = 0
	var rootlength = rootobj.length
	for (i = 0; i < rootlength; i++) {
		if (rootobj[i].className == classname)
			temparray[inc++] = rootobj[i]
	}
	return temparray
}

function sweeptoggle(ec) {
	var thestate = (ec == "expand") ? "block" : "none"
	var inc = 0
	while (ccollect[inc]) {
		ccollect[inc].style.display = thestate
		inc++
	}
	revivestatus()
}

function contractcontent(omit) {
	var inc = 0
	while (ccollect[inc]) {
		if (ccollect[inc].id != omit)
			ccollect[inc].style.display = "none"
		inc++
	}
}

function expandcontent(curobj, cid) {
	var spantags = curobj.getElementsByTagName("SPAN")
	var showstateobj = getElementbyClass(spantags, "showstate")
	if (ccollect.length > 0) {
		if (collapseprevious == "yes")
			contractcontent(cid)
		document.getElementById(cid).style.display = (document
				.getElementById(cid).style.display != "block") ? "block"
				: "none"
		if (showstateobj.length > 0) { // if "showstate" span exists in header
			if (collapseprevious == "no")
				showstateobj[0].innerHTML = (document.getElementById(cid).style.display == "block") ? contractsymbol
						: expandsymbol
			else
				revivestatus()
		}
	}
}

function revivecontent() {
	contractcontent("omitnothing")
	selectedItem = getselectedItem()
	selectedComponents = selectedItem.split("|")
	for (i = 0; i < selectedComponents.length - 1; i++)
		document.getElementById(selectedComponents[i]).style.display = "block"
}

function revivestatus() {
	var inc = 0
	while (statecollect[inc]) {
		if (ccollect[inc].style.display == "block")
			statecollect[inc].innerHTML = contractsymbol
		else
			statecollect[inc].innerHTML = expandsymbol
		inc++
	}
}

function get_cookie(Name) {
	var search = Name + "="
	var returnvalue = "";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search)
		if (offset != -1) {
			offset += search.length
			end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			returnvalue = unescape(document.cookie.substring(offset, end))
		}
	}
	return returnvalue;
}

function set_cookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getselectedItem() {
	if (get_cookie(window.location.pathname) != "") {
		selectedItem = get_cookie(window.location.pathname)
		return selectedItem
	} else
		return ""
}

function saveswitchstate() {
	var inc = 0, selectedItem = ""
	while (ccollect[inc]) {
		if (ccollect[inc].style.display == "block")
			selectedItem += ccollect[inc].id + "|"
		inc++
	}

	document.cookie = window.location.pathname + "=" + selectedItem
}

function do_onload() {
	uniqueidn = window.location.pathname + "firsttimeload"
	var alltags = document.all ? document.all : document
			.getElementsByTagName("*")
	ccollect = getElementbyClass(alltags, "switchcontent")
	statecollect = getElementbyClass(alltags, "showstate")
	if (enablepersist == "on" && ccollect.length > 0) {
		document.cookie = (get_cookie(uniqueidn) == "") ? uniqueidn + "=1"
				: uniqueidn + "=0"
		firsttimeload = (get_cookie(uniqueidn) == 1) ? 1 : 0 // check if this
																// is 1st page
																// load
		if (!firsttimeload)
			revivecontent()
	}
	if (ccollect.length > 0 && statecollect.length > 0)
		revivestatus()
}

if (window.addEventListener)
	window.addEventListener("load", do_onload, false)
else if (window.attachEvent)
	window.attachEvent("onload", do_onload)
else if (document.getElementById)
	window.onload = do_onload

if (enablepersist == "on" && document.getElementById)
	window.onunload = saveswitchstate

function resize_textarea(tid) {
	t = document.getElementById(tid);
	if (t != null) {
		a = t.value.split('\n');
		b = 1;
		b += a.length;
		if (b > t.rows)
			t.rows = b;
	}
}