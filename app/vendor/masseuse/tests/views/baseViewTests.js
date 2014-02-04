define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';
        var VIEW1_NAME = 'testView1',
            CHILD_VIEW_NAME = 'childView',
            should = chai.should();


        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('An instance of the BaseView', function () {


            //-----------Setup-----------
            var BaseView,
                RivetsView,
                viewInstance,
                options,
                methodSpy;

            beforeEach(function () {
                BaseView = masseuse.BaseView;
                RivetsView = masseuse.plugins.rivets.RivetsView;
                viewInstance = new BaseView({
                    name : VIEW1_NAME
                });
            });


            describe('initialize', function() {
                var OptionsView;

                beforeEach(function() {
                    options = {
                        defaultKey : true,
                        viewOptions : [
                            'defaultKey',
                            'passedInKey',
                            'extraKey'
                        ],
                        attributes : {
                            class : 'boom'
                        }
                    };

                    methodSpy = sinon.spy();

                    OptionsView = BaseView.extend({
                        name : VIEW1_NAME,
                        defaultOptions: options,
                        testDone : methodSpy
                    });
                });

                describe('options', function() {
                    describe('bindings', function() {
                        it('can listen to object events on things other than the view by using the bindings array',
                            function () {
                                options.bindings = [
                                    ['model', 'change', 'testDone']
                                ];
                                options.modelData = { test : 'test' };
                                viewInstance = new OptionsView(options);
                                methodSpy.should.not.have.been.called;
                                viewInstance.model.set('test', 'other');
                                methodSpy.should.have.been.calledOnce;
                            });
                        it('can listen to object events on the view iteslf by using the bindings array',
                            function (done) {
                                options.listeners = [
                                    ['afterTemplatingDone', 'testDone']
                                ];
                                options.modelData = { test : 'test' };
                                methodSpy.should.not.have.been.called;
                                new OptionsView(options)
                                    .start()
                                    .done(function() {
                                        methodSpy.should.have.been.calledOnce;
                                        done();
                                    });
                            });
                    });
                });

                it('a view instance can be newed up from BaseView', function() {
                    should.exist(viewInstance);
                });

                it('a view instance is initialized with view.defaultOptions if no options are passed in', function() {
                    var view = new OptionsView();
                    view.defaultKey.should.equal(true);
                    _.has(view, 'passedInKey').should.be.false;
                });
                it('a view instance is initialized with an extend of defaultOptions and passed in options', function() {
                    var view = new OptionsView({
                        passedInKey : true
                    });
                    view.defaultKey.should.equal(true);
                    view.passedInKey.should.equal(true);
                });
                it('a view instance is initialized with an extend of all arguments and defaultOptions', function() {

                    var view = new OptionsView({
                        passedInKey : true
                    },{
                        extraKey : true
                    });
                    view.defaultKey.should.equal(true);
                    view.passedInKey.should.equal(true);
                    view.extraKey.should.equal(true);
                });
                it('a view instance is initialized with the passed in options and ignores default options if the' +
                    ' second argument is false', function() {
                    var view = new OptionsView({
                        passedInKey : true
                    }, false);
                    _.has(view, 'defaultKey').should.be.false;
                    view.passedInKey.should.equal(true);
                });
                it('default options are applied to this.el', function() {
                    var view = new OptionsView();
                    $(view.el).attr('class').should.equal('boom');
                });

                describe('ViewContext', function() {
                    it('ViewContext should be run on modelData for an instance of BaseView', function() {
                        var view = new OptionsView({
                            modelData : {
                                name : masseuse.ViewContext('name')
                            }
                        });
                        view.model.get('name').should.equal(VIEW1_NAME);
                    });

                    it('ViewContext should be run on modelData for an instance of RivetView', function() {
                        var view = new RivetsView({
                            name : VIEW1_NAME,
                            modelData : {
                                name : masseuse.ViewContext('name')
                            }
                        });
                        view.model.get('name').should.equal(VIEW1_NAME);
                    });
                });
            });

            describe('remove method', function () {
                // method should wrap View.remove
                it('should call stop on all children', function () {
                    var childView = new (BaseView.extend({
                            name : CHILD_VIEW_NAME
                        }))(),
                        childRemove = sinon.spy(childView, 'remove');

                    viewInstance.addChild(childView);

                    childRemove.should.not.have.been.called;

                    viewInstance.remove();

                    childRemove.should.have.been.calledOnce;
                });
            });

            describe('children', function () {
                describe('addChild method', function () {
                    it('should be a method', function () {
                        viewInstance.addChild.should.be.a('function');
                    });

                    it('should add a child view', function () {
                        var childView = new BaseView({
                            name : CHILD_VIEW_NAME
                        });

                        viewInstance.children.length.should.equal(0);

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);
                    });

                    it('should not add the same child view twice', function () {
                        var childView = new BaseView({
                            name : CHILD_VIEW_NAME
                        });

                        viewInstance.children.length.should.equal(0);

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);
                    });
                });

                describe('removeChild method', function () {
                    it('should remove a child view, if it exists', function () {
                        var childView = new BaseView({
                            name : CHILD_VIEW_NAME
                        });

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);

                        viewInstance.removeChild(childView);

                        viewInstance.children.length.should.equal(0);
                    });

                    it('should not remove any child views if a matching view is not found', function () {
                        var childView = new BaseView({
                                name : CHILD_VIEW_NAME
                            }),
                            anotherChildView = new BaseView({
                                name : 'Another Child'
                            });

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);

                        viewInstance.removeChild(anotherChildView);

                        viewInstance.children.length.should.equal(1);
                    });
                });

                describe('removeAllChildren method', function () {
                    it('should remove all views from children', function () {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView();

                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        viewInstance.children.length.should.equal(2);

                        viewInstance.removeAllChildren();

                        viewInstance.children.length.should.equal(0);
                    });

                    it('should remove nested children', function () {
                        var childView1 = new BaseView(),
                            childSubView1 = new BaseView(),
                            childSubView2 = new BaseView();

                        childSubView1.addChild(childSubView2);
                        childView1.addChild(childSubView1);
                        viewInstance.addChild(childView1);

                        viewInstance.children.length.should.equal(1);
                        childView1.children.length.should.equal(1);
                        childSubView1.children.length.should.equal(1);

                        viewInstance.removeAllChildren();

                        viewInstance.children.length.should.equal(0);
                        childView1.children.length.should.equal(0);
                        childSubView1.children.length.should.equal(0);
                    });
                });

                describe('refreshChildren method', function () {
                    it('should start children that have not been started', function(done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            childStartView1 = sinon.spy(childView1, 'start'),
                            childStartView2 = sinon.spy(childView2, 'start');

                        viewInstance.addChild(childView1);
                        viewInstance.start()
                            .done(function () {
                                viewInstance.addChild(childView2);
                                childStartView1.should.have.been.calledOnce;
                                childStartView2.should.not.have.been.called;
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        childStartView1.should.have.been.calledTwice;
                                        childStartView2.should.have.been.calledOnce;
                                        done();
                                    });
                            });
                    });

                    it('should remove all the children and then call start on them', function (done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            childStartView1 = sinon.spy(childView1, 'start'),
                            childStartView2 = sinon.spy(childView2, 'start');

                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        viewInstance.start()
                            .done(function () {
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        childStartView1.should.have.been.calledTwice;
                                        childStartView2.should.have.been.calledTwice;
                                        done();
                                    });
                            });
                    });

                    it('should not remove the children from the parents children array.', function (done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            viewInstanceRemoveChild = sinon.spy(viewInstance, 'removeChild'),
                            viewInstanceRemoveAllChildren = sinon.spy(viewInstance, 'removeAllChildren');

                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        viewInstance.children.length.should.equal(2);
                        viewInstanceRemoveChild.should.not.have.been.called;
                        viewInstanceRemoveAllChildren.should.not.have.been.called;

                        viewInstance.start()
                            .done(function () {
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        viewInstance.children.length.should.equal(2);
                                        viewInstanceRemoveChild.should.not.have.been.called;
                                        viewInstanceRemoveAllChildren.should.not.have.been.called;
                                        done();
                                    });
                            });
                    });

                    it('should not remove the children of nested children.', function (done) {
                        var childView1 = new BaseView(),
                            childSubView1 = new BaseView();

                        childView1.addChild(childSubView1);
                        viewInstance.addChild(childView1);

                        viewInstance.children.length.should.equal(1);
                        childView1.children.length.should.equal(1);

                        viewInstance.start()
                            .done(function () {
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        viewInstance.children.length.should.equal(1);
                                        childView1.children.length.should.equal(1);
                                        done();
                                    });
                            });
                    });

                    it('should refresh nested children.', function (done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            childViewSub1 = new BaseView();

                        childViewSub1.start = sinon.spy(childViewSub1, 'start');

                        childView1.addChild(childViewSub1);
                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        childViewSub1.start.should.not.have.been.called;

                        viewInstance.start()
                            .done(function () {
                                childViewSub1.start.should.have.been.calledOnce;
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        childViewSub1.start.should.have.been.calledTwice;
                                        done();
                                    });
                            });
                    });
                });
            });

            describe('render', function() {
                var testDom = 'testDom',
                //riveted = 'riveted',
                    $body = $('body'),
                    view;

                beforeEach(function() {
                    var $div = $('<div id="' + testDom + '"/>');
                    $body.append($div);
                });

                afterEach(function() {
                    view.remove();
                    $('#' + testDom).html('');
                });

                describe('not including an options.el', function() {


                    describe('or id, tag, class, or attrs', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                template : '<div id="me"></div>'
                            });
                        });
                        it('will create an empty wrapping div for view.el', function() {
                            outerHtml($(view.el)).should.equal('<div></div>');
                        });
                        it('will render the template into that div', function(done) {
                            view.start().done(function() {
                                view.$el.html().should.equal('<div id="me"></div>');
                                done();
                            });
                        });
                        describe('and adding an option.appendTo sizzle', function() {
                            it('will append view.el to $(appendTo)', function (done) {
                                view = new BaseView({
                                    appendTo: '#' + testDom,
                                    template: '<div id="me"></div>'
                                });

                                view.start().done(function () {
                                    $('#' + testDom).html().should.equal('<div><div id="me"></div></div>');
                                    done();
                                });
                            });
                            it('will append view.el to $(appendTo) without a wrapper is `false === options.wrapper`',
                                function (done) {
                                    view = new BaseView({
                                        appendTo: '#' + testDom,
                                        template: '<div id="me"></div>',
                                        wrapper: false
                                    });

                                    view.start().done(function () {
                                        $('#' + testDom).html().should.equal('<div id="me"></div>');
                                        done();
                                    });
                                });
                        });
                    });

                    describe('supplying a classname', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                className : 'test'
                            });
                        });
                        it('will create a div with the right classname', function() {
                            outerHtml($(view.el)).should.equal('<div class="test"></div>');
                        });
                    });
                    describe('supplying a tagname', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                tagName : 'ul'
                            });
                        });
                        it('will create a div with the right tagname', function() {
                            outerHtml($(view.el)).should.equal('<ul></ul>');
                        });
                    });
                    describe('supplying a id', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                id : 'test'
                            });
                        });
                        it('will create a div with the right id', function() {
                            outerHtml($(view.el)).should.equal('<div id="test"></div>');
                        });
                    });
                    describe('supplying a attributes', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                attributes : { href : 'http://blah.ha' }
                            });
                        });
                        it('will create a div with the right attribute', function() {
                            outerHtml($(view.el)).should.equal('<div href="http://blah.ha"></div>');
                        });
                    });

                });

            });

            describe('modelData', function() {
                var MasseuseModel,
                    ProxyProperty,
                    ViewContext,
                    model;
                beforeEach(function() {
                    MasseuseModel = masseuse.MasseuseModel;
                    ProxyProperty = masseuse.ProxyProperty;
                    ViewContext = masseuse.ViewContext;
                    model = new MasseuseModel({
                        mark : 'twain'
                    });
                });
                it('ProxyProperties can be set via modelData', function() {
                    var view = new BaseView({
                        modelData : {
                            depth : ProxyProperty('mark', model)
                        }
                    });
                    view.model.get('depth').should.equal('twain');
                });
                it('ViewContext can be used on ProxyProperties via modelData', function() {
                    var view = new BaseView({
                            modelData : {
                                depth : ProxyProperty('mark', ViewContext('depthData'))
                            },
                            depthData : model,
                            viewOptions : ['depthData']
                        });

                    view.model.get('depth').should.equal('twain');
                });
            });
        });

        function outerHtml(ellie) {
            return $('<div>').append($(ellie).clone()).html();
        }
    });
