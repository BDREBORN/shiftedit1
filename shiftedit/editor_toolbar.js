define(["app/menus", "app/tabs", "app/editors", "app/modes"], function (menus, tabs, editors) {
var modes = require('app/modes').modes;

var changeMode = function(tab) {
    var editor = tabs.getEditor(tab);
    editors.setMode(editor, $(this).attr('data-name'));

    //set button value
    $(this).parent().prev().children('.ui-button-text').text($(this).text());
};

var modeItems = [];
modes.forEach(function (item) {
	modeItems.push({
	    name: item[0],
	    text: item[1],
	    handler: changeMode,
	    group: 'mode',
	    checked: false
	});
});

var menu = [{
	tooltip: 'Save',
	text: '<i class="fa fa-save"></i>',
	handler: function (tab) {
		tabs.save(tab);
	}
}, {
	tooltip: 'Undo',
	text: '<i class="fa fa-undo"></i>',
	handler: function (tab) {
		tabs.getEditor(tab).undo();
	}
}, {
	tooltip: 'Redo',
	text: '<i class="fa fa-undo fa-flip-horizontal"></i>',
	handler: function (button) {
		tabs.getEditor(tab).redo();
	}
}, /*{
	id: 'codeButton',
	text: '<i class="fa fa-picture-o"></i>',
	tooltip: 'Design View',
	enableToggle: true,
	handler: function (button) {
		toggleView(this.pressed);
	}
},*/ {
	id: 'codeSplit',
	text: '<i class="fa fa-columns"></i>',
	tooltip: 'Split',
	enableToggle: true,
	items: [{
		text: 'None',
		checked: true,
		handler: function (item, checked) {
			var editor = tabs.getEditor(tab);
			var sp = window.splits[tab.attr('id')];
			if (sp.getSplits() == 2) {
				secondSession = sp.getEditor(1).session;
			}
			sp.setSplits(1);
		},
		group: 'codeSplit'
	}, {
		text: 'Below',
		checked: false,
		handler: function (tab) {
			var secondSession = null;
			var editor = tabs.getEditor(tab);
			var sp = window.splits[tab.attr('id')];
			var newEditor = (sp.getSplits() == 1);
			sp.setOrientation(sp.BELOW);
			sp.setSplits(2);
			if (newEditor) {
				var session = secondSession || sp.getEditor(0).session;
				var newSession = sp.setSession(session, 1);
				newSession.name = session.name;
				editors.refresh(tab);
			}
		},
		group: 'codeSplit'
	}, {
		text: 'Beside',
		checked: false,
		handler: function (tab) {
			var secondSession = null;
			var editor = tabs.getEditor(tab);
			var sp = window.splits[tab.attr('id')];
			var newEditor = (sp.getSplits() == 1);
			sp.setOrientation(sp.BESIDE);
			sp.setSplits(2);
			if (newEditor) {
				var session = secondSession || sp.getEditor(0).session;
				var newSession = sp.setSession(session, 1);
				newSession.name = session.name;
				editors.refresh(tab);
			}
		},
		group: 'codeSplit'
	}]
}, {
    text: 'Mode',
	xtype: 'combobox',
	displayField: 'label',
	valueField: 'value',
	items: modeItems
},{
	id: 'revisionButton',
	text: '<i class="fa fa-clock-o"></i>',
	tooltip: 'Revision History',
	handler: function (tab) {
		revisions.show(tab);
	}
}, {
	id: 'syntaxErrorsButton',
	tooltip: 'Syntax Errors',
	text: '<i class="fa fa-warning"></i>',
	enableToggle: true,
	handler: function (tab) {
	    var panel = $('.ui-layout-center').tabs('getPanelForTab', tab);
	    $(panel).find('.editor_status').toggle();
	}
}];

function create(tab) {
    var panel = $('.ui-layout-center').tabs('getPanelForTab', tab);
    menus.create($(panel).find(".editor_toolbar"), menu, tab);

    //select mode
    var editor = tabs.getEditor(tab);
    var mode = editor.getSession().$modeId.substr(9);
    $(panel).find('[data-name='+mode+']').children('a').trigger('click');
}

return {
    create: create
};

});