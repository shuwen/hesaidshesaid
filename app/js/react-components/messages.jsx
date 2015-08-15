var Message = React.createClass({
	render: function() {
		return (
			<div className={'message '+this.props.type}>
				<span>{this.props.message}</span>
			</div>
		);
	}
});

var Messenger = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	componentWillUpdate: function() {
	  var messagePane = this.getDOMNode().querySelector('#messagePane');
	  this.shouldScrollBottom = messagePane.scrollTop + messagePane.offsetHeight === messagePane.scrollHeight;
	},
	 
	componentDidUpdate: function() {
	  if (this.shouldScrollBottom) {
	    var messagePane = this.getDOMNode().querySelector('#messagePane');
	    messagePane.scrollTop = messagePane.scrollHeight
	  }
	},

	getInitialState: function() {
		return {
			messages: [{message: 'Hello'}],
			inputBuffer: ''
		}
	},

	render: function() {
		return (
			<div className="messenger">
				<div id="headerPane"></div>
				<div id="messagePane">
					{this.state.messages.map(function(message) {
						return (
							<Message message={message.message} type={message.type}></Message>
						);
					})}
					<div id="indicator" className="message indicator" hidden={this.state.inputBuffer === ''}>
						<span>
						<i className="point"></i>
						<i className="point"></i>
						<i className="point"></i>
						</span>
					</div>
				</div>
				<div id="inputPane">
					<form onSubmit={this.handleSubmit}>
						<input id="textInput" type="text" valueLink={this.linkState('inputBuffer')}></input>
						<input type="submit"></input>
					</form>
				</div>
			</div>
		);
	},

	handleSubmit: function(e) {
		e.preventDefault();
		if(this.state.inputBuffer) {
			this.post(this.state.inputBuffer, true);
			this.setState({inputBuffer: ''});
		}
	},

	handleInputChange: function(e) {
		this.setState({inputBuffer: e.target.value});
	},

	post: function(input, self) {
		console.log(input);
		this.setState({
			messages: this.state.messages.concat([
				{
					message: input,
					type: self ? 'self' : 'default'
				}
			])
		});
	}
});
