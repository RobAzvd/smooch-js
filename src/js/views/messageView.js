var Marionette = require('backbone.marionette');
var $ = require('jquery');
var _ = require('underscore');

var htmlUtils = require('../utils/html');

var template = require('../../templates/message.tpl');

module.exports = Marionette.ItemView.extend({
    template: template,
    className: function() {
        return 'sk-row ' + (this._isAppMaker() ? 'sk-left-row' : 'sk-right-row');
    },

    ui: {
        name: '[data-ui-name]',
        message: '[data-ui-message]',
        avatar: '[data-ui-avatar]',
        action: '.sk-action'
    },

    events: {
        'mouseup @ui.action': 'onActionMouseup'
    },

    behaviors: {
        stickit: {
            '@ui.name': {
                observe: 'name',
                onGet: function(value) {
                    return this._isAppMaker() ? value : '';
                }
            },
            '@ui.message': {
                observe: ['text', 'actions'],
                update: function($el, values) {
                    if (values[0].trim().length > 0) {

                        var escapedText = $('<div/>').text(values[0]).html().replace(/\n/g, '<br />');

                        escapedText = htmlUtils.autolink(escapedText, {
                            class: 'link',
                            target: '_blank'
                        });

                        if (values[1] && values[1].length > 0) {
                            $el.addClass('has-actions');
                        }

                        $el.html(escapedText);
                    }
                }
            },
            '@ui.avatar': {
                observe: 'avatarUrl',
                update: function($el, avatarUrl) {
                    if (this._isAppMaker()) {
                        $el.attr('src', avatarUrl);
                    }
                },
                visible: function() {
                    return this._isAppMaker();
                },
                updateView: true
            }
        }
    },

    _isAppMaker: function() {
        return this.model.get('role') !== 'appUser';
    },

    serializeData: function() {
        var data = Marionette.ItemView.prototype.serializeData.call(this);

        return _.defaults(data, {
            actions: []
        });
    },

    // Actions were remaining focused on mouseup, causing strange coloration until blurred
    onActionMouseup: function(e) {
        $(e.target).blur();
    }
});
