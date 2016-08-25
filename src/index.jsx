import React from 'react';
import styles from './crop-selector.css';

export default class CropSelector extends React.Component {
	static propTypes = {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		onChange: React.PropTypes.func,
		x1: React.PropTypes.number,
		y1: React.PropTypes.number,
		x2: React.PropTypes.number,
		y2: React.PropTypes.number,
	};

	static defaultProps = {
		x1: 0,
		y1: 0,
		x2: 100,
		y2: 100,
	};

	constructor({ width, height, x1, y1, x2, y2 }) {
		super();

		this.state = {
			x1: Math.round((width / 100) * x1),
			y1: Math.round((height / 100) * y1),
			x2: Math.round((width / 100) * x2),
			y2: Math.round((height / 100) * y2),
		};

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	componentWillReceiveProps({ width, height, x1, y1, x2, y2 }) {
		this.setState({
			x1: Math.round((width / 100) * x1),
			y1: Math.round((height / 100) * y1),
			x2: Math.round((width / 100) * x2),
			y2: Math.round((height / 100) * y2),
		});
	}

	onDragStart(ev) {
		ev.preventDefault();

		const { x1, y1, x2, y2 } = this.state;
		this.startCoords = { x1, y1, x2, y2 };
		this.startPos = { x: ev.pageX, y: ev.pageY };

		this.handle = ev.target.dataset.handle || '';
		this.lock = {
			x1: this.handle ? !/W/.test(this.handle) : false,
			y1: this.handle ? !/N/.test(this.handle) : false,
			x2: this.handle ? !/E/.test(this.handle) : false,
			y2: this.handle ? !/S/.test(this.handle) : false,
		};

		window.addEventListener('mousemove', this.onDragMove);
		window.addEventListener('mouseup', this.onDragEnd);
	}

	onDragMove(ev) {
		const pos = { x: ev.pageX, y: ev.pageY };
		const dX = pos.x - this.startPos.x;
		const dY = pos.y - this.startPos.y;

		const { x1, y1, x2, y2 } = this.startCoords;
		this.setPosition(
			this.lock.x1 ? x1 : x1 + dX,
			this.lock.y1 ? y1 : y1 + dY,
			this.lock.x2 ? x2 : x2 + dX,
			this.lock.y2 ? y2 : y2 + dY,
		);
	}

	onDragEnd() {
		this.handle = '';

		window.removeEventListener('mousemove', this.onDragMove);
		window.removeEventListener('mouseup', this.onDragEnd);
	}

	setPosition(x1, y1, x2, y2) {
		const { width: maxX, height: maxY } = this.props;
		const width = x2 - x1;
		const height = y2 - y1;

		if (x1 < 0) {
			x1 = 0;
			x2 = this.lock.x2 ? x2 : x1 + width;
		}

		if (x2 > maxX) {
			x2 = maxX;
			x1 = this.lock.x1 ? x1 : x2 - width;
		}

		if (y1 < 0) {
			y1 = 0;
			y2 = this.lock.y2 ? y2 : y1 + height;
		}

		if (y2 > maxY) {
			y2 = maxY;
			y1 = this.lock.y1 ? y1 : y2 - height;
		}

		this.setState({ x1, y1, x2, y2 });

		if (this.props.onChange) {
			this.props.onChange(
				Math.round((100 / maxX) * x1),
				Math.round((100 / maxY) * y1),
				Math.round((100 / maxX) * x2),
				Math.round((100 / maxY) * y2)
			);
		}
	}

	render() {
		const { width, height } = this.props;
		const { x1, y1, x2, y2 } = this.state;

		const cropStyle = {
			width: x2 - x1,
			height: y2 - y1,
			transform: `translate(${x1}px, ${y1}px)`,
		};

		const overlays = [
			{ width: x2 - x1, height: y1, transform: `translateX(${x1}px)` },
			{ width: width - x2, height, transform: `translateX(${x2}px)` },
			{ width: x2 - x1, height: height - y2, transform: `translate(${x1}px, ${y2}px)` },
			{ width: x1, height },
		];

		const handles = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

		return (
			<div
				className={styles.container}
				style={{ width, height }}
				ref={el => { this.containerEl = el; }}
			>
				{overlays.map((style, index) => (
					<div key={index} className={styles.overlay} style={style} />
				))}
				<div
					className={styles.crop}
					style={cropStyle}
					onMouseDown={this.onDragStart}
				>
					{handles.map(handle => (
						<div
							key={handle}
							className={styles.handle}
							data-handle={handle}
						/>
					))}
				</div>
			</div>
		);
	}
}
