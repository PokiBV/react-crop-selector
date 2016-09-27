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
		minWidth: React.PropTypes.number,
		minHeight: React.PropTypes.number,
		ratio: React.PropTypes.string,
		guide: React.PropTypes.oneOf(['rule-of-thirds']),
	};

	static defaultProps = {
		x1: 0,
		y1: 0,
		x2: 100,
		y2: 100,
		minWidth: 0,
		minHeight: 0,
	};

	constructor({ width, height, x1, y1, x2, y2 }) {
		super();

		this.state = {
			dragging: false,
			x1: Math.round((width / 100) * x1),
			y1: Math.round((height / 100) * y1),
			x2: Math.round((width / 100) * x2),
			y2: Math.round((height / 100) * y2),
		};

		this.lock = {
			x1: false,
			y1: false,
			x2: false,
			y2: false,
		};

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	componentWillMount() {
		const { x1, y1, x2, y2 } = this.state;
		const { width: maxWidth, height: maxHeight, minWidth, minHeight, ratio } = this.props;

		this.handle = 'N';
		const coords = this.adjustPosition(
			x1, y1, x2, y2,
			maxWidth, maxHeight,
			minWidth, minHeight,
			ratio
		);
		this.handle = '';

		if (
			x1 === coords.x1 && y1 === coords.y1 &&
			x2 === coords.x2 && y2 === coords.y2
		) {
			return;
		}

		const width = coords.x2 - coords.x1;
		const height = coords.y2 - coords.y1;

		coords.x1 = Math.round((maxWidth - width) / 2);
		coords.x2 = coords.x1 + width;
		coords.y1 = Math.round((maxHeight - height) / 2);
		coords.y2 = coords.y1 + height;

		this.setState(coords);

		if (this.props.onChange) {
			this.props.onChange(
				(100 / maxWidth) * coords.x1,
				(100 / maxHeight) * coords.y1,
				(100 / maxWidth) * coords.x2,
				(100 / maxHeight) * coords.y2
			);
		}
	}

	componentWillReceiveProps({ x1, y1, x2, y2, width, height, minWidth, minHeight, ratio }) {
		this.handle = 'N';

		this.setPosition(
			Math.round((width / 100) * x1),
			Math.round((height / 100) * y1),
			Math.round((width / 100) * x2),
			Math.round((height / 100) * y2),
			width,
			height,
			minWidth,
			minHeight,
			ratio
		);

		this.handle = '';
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

		this.setState({ dragging: true });

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
			this.props.width,
			this.props.height,
			this.props.minWidth,
			this.props.minHeight,
			this.props.ratio,
		);
	}

	onDragEnd() {
		this.handle = '';
		this.setState({ dragging: false });

		window.removeEventListener('mousemove', this.onDragMove);
		window.removeEventListener('mouseup', this.onDragEnd);
	}

	setPosition(x1, y1, x2, y2, width, height, minWidth, minHeight, ratio) {
		const coords = this.adjustPosition(x1, y1, x2, y2, width, height, minWidth, minHeight, ratio);

		if (
			this.state.x1 === coords.x1 && this.state.y1 === coords.y1 &&
			this.state.x2 === coords.x2 && this.state.y2 === coords.y2
		) {
			return;
		}

		this.setState(coords);

		if (this.props.onChange) {
			this.props.onChange(
				(100 / width) * coords.x1,
				(100 / height) * coords.y1,
				(100 / width) * coords.x2,
				(100 / height) * coords.y2
			);
		}
	}

	adjustPosition(x1, y1, x2, y2, maxWidth, maxHeight, absMinWidth, absMinHeight, ratioString) {
		const minWidth = (maxWidth / 100) * absMinWidth;
		const minHeight = (maxHeight / 100) * absMinHeight;
		let width = x2 - x1;
		let height = y2 - y1;

		if (x1 < 0) {
			x1 = 0;
			x2 = this.lock.x2 ? x2 : x1 + width;
		}

		if (x2 > maxWidth) {
			x2 = maxWidth;
			x1 = this.lock.x1 ? x1 : x2 - width;
		}

		if (y1 < 0) {
			y1 = 0;
			y2 = this.lock.y2 ? y2 : y1 + height;
		}

		if (y2 > maxHeight) {
			y2 = maxHeight;
			y1 = this.lock.y1 ? y1 : y2 - height;
		}

		width = x2 - x1;
		height = y2 - y1;

		if (width < minWidth && this.handle) {
			width = minWidth;

			if (/E/.test(this.handle)) {
				x2 = x1 + width;
			} else if (/W/.test(this.handle)) {
				x1 = x2 - width;
			}
		}

		if (height < minHeight && this.handle) {
			height = minHeight;

			if (/N/.test(this.handle)) {
				y1 = y2 - height;
			} else if (/S/.test(this.handle)) {
				y2 = y1 + height;
			}
		}

		if (ratioString && this.handle) {
			const ratio = ratioString.split(':').map(i => parseInt(i, 10));

			if (/(?:N|S)/.test(this.handle)) {
				width = Math.round((height / ratio[1]) * ratio[0]);

				if (width < minWidth) {
					width = minWidth;
					height = Math.round((width / ratio[0]) * ratio[1]);

					if (/S/.test(this.handle)) {
						y2 = y1 + height;
					} else {
						y1 = y2 - height;
					}
				}

				if (/W/.test(this.handle)) {
					x1 = x2 - width;
				} else {
					x2 = x1 + width;
				}

				if (x1 < 0 || x2 > maxWidth) {
					if (x1 < 0) {
						x1 = 0;
					}

					if (x2 > maxWidth) {
						x2 = maxWidth;
					}

					width = x2 - x1;
					height = Math.round((width / ratio[0]) * ratio[1]);

					if (/S/.test(this.handle)) {
						y2 = y1 + height;
					} else {
						y1 = y2 - height;
					}
				}
			}

			if (/(?:E|W)/.test(this.handle)) {
				height = Math.round((width / ratio[0]) * ratio[1]);

				if (height < minHeight) {
					height = minHeight;
					width = Math.round((height / ratio[1]) * ratio[0]);

					if (/E/.test(this.handle)) {
						x2 = x1 + width;
					} else {
						x1 = x2 - width;
					}
				}

				if (/N/.test(this.handle)) {
					y1 = y2 - height;
				} else {
					y2 = y1 + height;
				}

				if (y1 < 0 || y2 > maxHeight) {
					if (y1 < 0) {
						y1 = 0;
					}

					if (y2 > maxHeight) {
						y2 = maxHeight;
					}

					height = y2 - y1;
					width = Math.round((height / ratio[1]) * ratio[0]);

					if (/E/.test(this.handle)) {
						x2 = x1 + width;
					} else {
						x1 = x2 - width;
					}
				}
			}
		}

		return {
			x1: Math.round(x1),
			y1: Math.round(y1),
			x2: Math.round(x2),
			y2: Math.round(y2),
		};
	}

	render() {
		const { width, height, guide, ratio } = this.props;
		const { dragging, x1, y1, x2, y2 } = this.state;

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

		const handles = ratio ? [] : ['N', 'E', 'S', 'W'];
		handles.push('NE', 'SE', 'SW', 'NW');

		const classes = [styles.container];
		if (dragging) {
			classes.push(styles.dragging);
		}

		return (
			<div
				className={classes.join(' ')}
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
					{guide === 'rule-of-thirds' && (
						<div className={`${styles.guides} ${styles.ruleOfThirds}`}>
							<div className={styles.guideHorz1} />
							<div className={styles.guideHorz2} />
							<div className={styles.guideVert1} />
							<div className={styles.guideVert2} />
						</div>
					)}
				</div>
			</div>
		);
	}
}
