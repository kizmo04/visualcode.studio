import React, { Component } from "react";
import {
  CanvasSpace,
  Create,
  Pt,
  World,
  Body,
  Particle,
  Num,
  Group,
  Circle,
  Const,
  Line,
  CanvasForm,
  Rectangle,
  Polygon,
  Geom,
  Curve
} from "pts";
import _ from "lodash";
import styles from "./PtsCanvas.module.scss";
import async from "async";

class PtsCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.space = null;
    this.pairs = [];
    this.form = null;
    this.world = null;
    this.square = null;
    this.poly = null;
    this.chain = new Group();
    this.pts = null;
    this.temp = null;
  }

  drawCollinear(speed = 0.1) {
    this.space = new CanvasSpace(this.canvasRef).setup({
      bgcolor: "transparent",
      resize: false,
      retina: true
    });

    this.form = this.space.getForm();

    this.space.add({
      start: bound => {
        let r = this.space.size.minValue().value / 2;

        for (let i = 0; i < 200; i++) {
          let ln = new Group(Pt.make(2, r, true), Pt.make(2, -r, true));
          ln.moveBy(this.space.center).rotate2D(
            (i * Math.PI) / 200,
            this.space.center
          );
          this.pairs.push(ln);
        }
      },

      animate: (time, ftime) => {
        for (let i = 0, len = this.pairs.length; i < len; i++) {
          let ln = this.pairs[i];
          ln.rotate2D(Const.one_degree * speed, this.space.center);
          let collinear = Line.collinear(ln[0], ln[1], this.space.pointer, 0.1);

          if (collinear) {
            this.form.stroke("#fff").line(ln);
          } else {
            let side = Line.sideOfPt2D(ln, this.space.pointer);
            this.form
              .stroke(side < 0 ? "rgba(255,255,0,.1)" : "rgba(0,255,255,.1)")
              .line(ln);
          }

          this.form.fillOnly("rgba(255,255,255,0.8").points(ln, 0.5);
        }
      }
    });

    this.space.play();
  }

  drawRectangle(stringLength) {
    this.space = new CanvasSpace(this.canvasRef).setup({
      bgcolor: "transparent",
      resize: false,
      retina: true
    });

    this.form = this.space.getForm();

    this.space.add({
      start: (bound, space) => {
        this.world = new World(space.innerBound, 0.8, new Pt(0, 500));

        let unit = (space.size.x + space.size.y) / 150;
        this.square = Body.fromGroup(
          Polygon.rectangle(
            space.center.subtract(100, 50),
            unit * stringLength,
            unit
          )
        );

        this.world.add(this.square);
      },

      animate: (time, ftime) => {
        this.world.drawBodies((b, i) => {
          this.form.fillOnly("#f03").polygon(b);
          this.form.strokeOnly("rgba(0,0,0,0.1");
          b.linksToLines().forEach(l => this.form.line(l));
        });

        this.world.update(ftime);
      }
    });

    setInterval(() => {
      let min = 0;
      let max = this.space.size.minValue().value;
      let r1 = Math.floor(Math.random() * (max - min) + min);
      let r2 = Math.floor(Math.random() * (max - min) + min);

      if (r1 % 2 === 0) {
        r1 = -r1;
      }
      if (r2 % 2 === 0) {
        r2 = -r2;
      }
      this.square[0].hit(Pt.make(2, r1, true), Pt.make(2, r2, true));
    }, 50);
    this.space.play();
  }

  drawPoly(number) {
    this.space = new CanvasSpace(this.canvasRef).setup({
      bgcolor: "transparent",
      resize: false,
      retina: true
    });

    this.form = this.space.getForm();

    this.space.add({
      start: (bound, space) => {
        this.world = new World(space.innerBound, 1, new Pt(0, 0));

        let unit = (space.size.x + space.size.y) / 150;

        this.poly = Body.fromGroup(
          Polygon.fromCenter(space.center.subtract(100, 50), unit * 4, number),
          0.5
        );

        this.world.add(this.poly);
      },

      animate: (time, ftime) => {
        this.world.drawBodies((b, i) => {
          this.form.fillOnly("rgba(255,0,0,0.5)").polygon(b);
          this.form.strokeOnly("rgba(0,0,0,0.1");
          b.linksToLines().forEach(l => this.form.line(l));
        });

        this.world.update(ftime);
      }
    });

    setInterval(() => {
      let min = 400;
      let max = 1000;
      let r1 = Math.floor(Math.random() * (max - min) + min);
      let r2 = Math.floor(Math.random() * (max - min) + min);

      if (r1 % 2 === 0) {
        r1 = -r1;
      }
      if (r2 % 2 === 0) {
        r2 = -r2;
      }
      this.poly[Math.abs(r1) % this.poly.length].hit(
        Pt.make(2, r1, true),
        Pt.make(2, r2, true)
      );
    }, 500);
    this.space.play();
  }

  drawParticle() {
    this.space = new CanvasSpace(this.canvasRef).setup({
      bgcolor: "transparent",
      resize: false,
      retina: true
    });

    this.form = this.space.getForm();

    this.space.add({
      start: (bound, space) => {
        this.world = new World(space.innerBound, 0.8, new Pt(0, 500));

        let unit = (space.size.x + space.size.y) / 150;

        this.poly = new Particle(new Pt(space.center.x, 100)).size(unit * 4);
        this.world.add(this.poly);
      },

      animate: (time, ftime) => {
        let min = 0;
        let max = 255;
        let r = Math.floor(Math.random() * (max - min) + min);
        this.world.drawParticles((p, i) =>
          this.form
            .fillOnly(
              `rgba(${(50 + r) % 254},${(200 + r) % 254},${(150 + r) %
                254},0.5)`
            )
            .point(p, p.radius + p.radius * 0.2 * (r % 2 ? -1 : +1), "circle")
        );

        this.world.update(ftime);
      }
    });

    setInterval(() => {
      let min = 0;
      let max = this.space.size.minValue().value;
      let r1 = Math.floor(Math.random() * (max - min) + min);
      let r2 = Math.floor(Math.random() * (max - min) + min);

      if (r1 % 2 === 0) {
        r1 = -r1;
      }
      if (r2 % 2 === 0) {
        r2 = -r2;
      }

      this.poly.hit(r1, r2);
    }, 500);

    this.space.play();
  }

  drawCurve(length) {
    this.space = new CanvasSpace(this.canvasRef).setup({
      bgcolor: "transparent",
      resize: false,
      retina: true
    });

    this.form = this.space.getForm();

    length = length || 3;

    console.log("length: ", length);

    this.space.add({
      animate: (time, ftime) => {
        if (this.chain.length > length && this.chain.length % 3 === 0)
          this.chain.splice(0, 3);
        for (let i = 4, len = this.chain.length; i < len; i += 3) {
          this.chain[i].rotate2D(
            i % 7 === 0 ? 0.002 : -0.003,
            this.chain[i - 1]
          );

          this.chain[i - 2].to(
            Geom.interpolate(this.chain[i], this.chain[i - 1], 2)
          );
        }
        this.form
          .strokeOnly(
            `rgba(${(50 + length) % 254},${(200 + length) % 254},${(150 +
              length) %
              254},0.5)`,
            1
          )
          .line(Curve.cardinal(this.chain, 10, 1));
        this.form
          .strokeOnly("rgba(255,255,255,0.3)", 1)
          .line(Curve.cardinal(this.chain, 10, 1));
        this.form.fill("rgba(255,255,255,0.7)").points(this.chain, 5, "square");
      }
    });
    setInterval(() => {
      let min = 0;
      let max = this.space.size.minValue().value / 2;
      let r1 = Math.floor(Math.random() * (max - min) + min);
      let r2 = Math.floor(Math.random() * (max - min) + min);

      if (r1 % 2 === 0) {
        r1 = -r1;
      }
      if (r2 % 2 === 0) {
        r2 = -r2;
      }

      let p = new Pt(this.space.center.$add(r1, r2));

      if (this.chain.length < 1) {
        this.chain.push(p);
      } else {
        if (p.$subtract(this.chain.q1).magnitudeSq() > 900) {

          if (this.chain.length === 4) {
            this.chain.push(p);
            this.chain.q3.to(Geom.interpolate(this.chain.q1, this.chain.q2, 2));
          } else if (this.chain.length > 4 && this.chain.length % 3 === 0) {
            this.chain.push(p);
            this.chain.push(Geom.interpolate(this.chain.q2, this.chain.q1, 2));
          } else {
            this.chain.push(p);
          }
        }
      }
    }, 50);
    this.space.play();
  }

  componentDidMount() {
    const { variable, operationType } = this.props;
    console.log("variables", variable);
    const loopStatement = [
      "ForStatement",
      "ForInStatement",
      "DoWhileStatement",
      "WhileStatement"
    ];
    if (loopStatement.includes(operationType)) {
      this.drawCollinear(5);
    } else if (
      variable.type === "Function" ||
      operationType === "FunctionDeclaration"
    ) {
      this.drawCollinear();
    } else if (variable.type === "string") {
      this.drawRectangle(variable.value.length);
    } else if (variable.type === "number") {
      this.drawPoly(variable.value);
    } else if (variable.type === "undefined") {
      this.drawParticle();
    } else if (variable.type === "Array" || variable.type === "ArrayLike") {
      this.drawCurve(variable.value.length);
    }
  }

  // componentDidMount() {
  //   const that = this;
  //   // async.series([
  //   //   cb => {that.init(); cb(null)},
  //   //   cb => {that._loop()},
  //   //   cb => {
  //   //     console.log('first time false')
  //   //     that.firstTime = false;
  //   //   }
  //   // ])
  //   this.init()
  //   this._loop()
  //   this.firstTime = false;
  // }

  // componentDidUpdate(prevProps) {
  //   if (JSON.stringify(prevProps.scopes) !== JSON.stringify(this.props.scopes)) {
  //     console.log('update props')
  //     this.pathPairs = [];
  //     this.lines = [];
  //     const { scopes } = this.props;
  //     const r = this.space.size.minValue().value / 2;

  //     for (let i = 0; i < scopes.length; i++) {
  //       let path = new Group(Pt.make(2, r, true), Pt.make(2, -r, true));
  //       path.moveBy(this.space.center).rotate2D( i * Math.PI / scopes.length, this.space.center);
  //       this.pathPairs.push(path);
  //     }

  //   this.pathPairs.forEach(path => {
  //     path.rotate2D(Const.one_degree / 10, this.space.center);
  //     // console.log(line)
  //     let line = Line.subpoints(path, 50);
  //     this.lines.push(line);
  //   });
  //   }
  //   this._loop();
  //   console.log(this.lines, this.pathPairs)
  //   // async.series([
  //   //   cb => {this.init(); cb(null)},
  //   //   cb => {this._loop()}
  //   // ])
  //   // this.togglePause();
  //   // this._loop();
  // }

  // _loop() {
  //   console.log('loop! ')
  //   const that = this;
  //   if (this.firstTime) {
  //     console.log('loop play')
  //     this.space.play();
  //   } else {
  //     console.log('loop resume')
  //     this.space.resume();
  //   }
  //   setTimeout(() => {
  //     that.space.pause();
  //     that.paused = true;
  //   }, 500);
  // }

  // togglePause() {
  //   console.log('in pause', this)
  //   this.space.resume();
  //   const that = this;
  //   setTimeout(() => {
  //     that.space.pause();
  //   }, 500);
  // }

  // add(p) {

  // }

  // animate(time, ftime) {
  //   // console.log('animate', this.props.scopes)

  //   let t = Num.cycle( (time%5000)/5000 );

  //   // console.log(this.lines)
  //   const colors = ["#ff2d5d", "#42dc8e", "#2e43eb", "#ffe359"];
  //   this.lines.forEach((line, i) => {
  //     let pathIndex = Math.floor(t * (line.length - 1));
  //     this.form.strokeOnly(colors[i * 3 % 4]).point(line[pathIndex % line.length], this.props.scopes[i], "circle");
  //   })
  //   // for (let i = 0; i < this.pathPairs.length; i++) {
  //   //   let path = this.pathPairs[i];
  //   //   let line = Line.subpoints(path, 500);
  //   //   path.rotate2D( Const.one_degree / 10, this.space.center);

  //   //   console.log(line)
  //   // }

  // }

  // start(bound) {
  //   // console.log('start', scopes)
  //   this.pathPairs = [];
  //   this.lines = [];
  //   const { scopes } = this.props;
  //   const r = this.space.size.minValue().value / 2;

  //   for (let i = 0; i < scopes.length; i++) {
  //     let path = new Group(Pt.make(2, r, true), Pt.make(2, -r, true));
  //     path.moveBy(this.space.center).rotate2D( i * Math.PI / 200, this.space.center);
  //     this.pathPairs.push(path);
  //   }

  // }

  // resize(size, ev) {

  // }

  // action(type, px, py, ev) {

  // }

  // init() {
  //   console.log('init!!!')
  //   this.space = new CanvasSpace(this.canvasRef).setup({bgcolor: 'transparent', resize: false, retina: true});
  //   this.form = new CanvasForm(this.space);

  //   this.space.add({
  //     start: this.start,
  //     animate: this.animate,
  //   });
  // }

  // defineShapeScopeProperties(scope) {
  //   const shapes = {};
  //   const r = this.space.size.minValue().value / 2;
  //   _.forOwn(scope, (value, key) => {
  //     const type = typeof value;
  //     if (Array.isArray(value)) {
  //       shapes[key] = ""

  //     } else if (type === "object") {

  //     } else if (type === "string") {
  //       const point = new Group(Pt.make(2, r, true), Pt.make(2, -r, true));
  //       shapes[key] = Rectangle.corners(point);
  //     } else if (type === "number") {
  //       const point = Pt.make(2, r, true);
  //       shapes[key] = Polygon.fromCenter(point, Math.floor(value / 2), value);
  //     } else if (type === "undefined") {

  //     }
  //   });
  // }
  render() {
    return <canvas className={styles.size} ref={c => (this.canvasRef = c)} />;
  }
}

export default PtsCanvas;
