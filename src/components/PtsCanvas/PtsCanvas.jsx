import React, { Component } from "react";
import {
  CanvasSpace,
  Pt,
  World,
  Body,
  Particle,
  Group,
  Const,
  Line,
  Polygon,
  Geom,
  Curve,
} from "pts";
import styles from "./PtsCanvas.module.scss";

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
    this.variable = null;
    this.isRotate = false;
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
        this.world = new World(space.innerBound, 0.8, new Pt(0, 0));

        let unit = (space.size.x + space.size.y) / 150;
        this.square = Body.fromGroup(
          Polygon.rectangle(
            space.center.subtract(100, 50),
            unit * stringLength,
            unit
          )
        );

        this.world.add(this.square);

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
        }, 500);
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

  drawParticle(type) {
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
      },

      animate: (time, ftime) => {
        let min = 0;
        let max = 255;
        let r = Math.floor(Math.random() * (max - min) + min);
        this.world.drawParticles((p, i) =>
          this.form
            .fillOnly(
              !type
                ? `rgba(${(50 + r) % 254},${(200 + r) % 254},${(150 + r) %
                    254},0.5)`
                : type === "object"
                  ? "rgba(0, 200, 235, 0.6)"
                  : type === "true"
                    ? "rgba(100, 0, 135, 0.6)"
                    : "rgba(240, 200, 0, 0.6)"
            )
            .point(
              p,
              !type
                ? p.radius + p.radius * 0.2 * (r % 2 ? -4 : +1)
                : p.radius * 0.8,
              type !== "object" ? "circle" : "square"
            )
        );

        let r1 = Math.floor(Math.random() * (max - min) + min);
        let r2 = Math.floor(Math.random() * (max - min) + min);

        if (r1 % 2 === 0) {
          r1 = -r1;
        }
        if (r2 % 2 === 0) {
          r2 = -r2;
        }

        this.poly.hit(r1, r2);

        this.world.update(ftime);
      }
    });

    this.space.play();
  }

  drawCurve(length) {
    this.space = new CanvasSpace(this.canvasRef).setup({
      bgcolor: "transparent",
      resize: false,
      retina: true
    });

    this.form = this.space.getForm();
    length = length - 2 || 3;

    this.space.add({
      animate: (time, ftime) => {
        if (this.chain.length > length && this.chain.length % 3 === 0) {
          this.chain.splice(0, 3);
        }
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
          } else if (this.chain.length < 10 && this.chain.length % 3 === 0) {
            this.chain.push(p);
            this.chain.push(Geom.interpolate(this.chain.q2, this.chain.q1, 2));
          } else {
            this.chain.push(p);
          }
        }
      }
    }, 500);
    this.space.play();
  }

  componentDidMount() {
    const { variable, operationType } = this.props;
    const loopStatement = [
      "ForStatement",
      "ForInStatement",
      "DoWhileStatement",
      "WhileStatement"
    ];
    if (
      loopStatement.includes(operationType) &&
      variable.identifier === "scopeName"
    ) {
      if (!this.isRotate) {
        this.isRotate = true;
        this.space.removeAll();
        this.drawCollinear(5);
      }
    } else if (
      variable.identifier === "scopeName" &&
      variable.value !== "Global" &&
      (operationType === "FunctionDeclaration" ||
        operationType === "FunctionExpression")
    ) {
      if (!Object.keys(this.space.players).length) this.drawCollinear();
    } else if (variable.type === "string") {
      this.drawRectangle(variable.value.length);
    } else if (variable.type === "number") {
      this.drawPoly(parseInt(variable.value) < 3 ? 3 : variable.value);
    } else if (variable.type === "undefined") {
      this.drawParticle();
    } else if (variable.type === "Array" || variable.type === "ArrayLike") {
      this.drawCurve(variable.value.length);
    } else if (variable.type === "Object") {
      this.drawParticle("object");
    } else if (variable.type === "boolean") {
      if (variable.value === "true") {
        this.drawParticle("true");
      } else {
        this.drawParticle("false");
      }
    }
    this.variable = variable;
  }

  componentDidUpdate(prevProps) {
    const { variable, operationType } = this.props;
    const loopStatement = [
      "ForStatement",
      "ForInStatement",
      "DoWhileStatement",
      "WhileStatement"
    ];

    if (
      loopStatement.includes(operationType) &&
      prevProps.variable.identifier === "scopeName" &&
      variable.identifier === "scopeName" &&
      prevProps.variable.value === variable.value
    ) {
      if (!this.isRotate) {
        this.space.removeAll();
        this.isRotate = true;
        this.drawCollinear(5);
      }
      this.isRotate = true;
    } else if (
      prevProps.variable.identifier === variable.identifier &&
      prevProps.variable.value !== variable.value
    ) {
      if (this.space) this.space.removeAll();

      if (
        prevProps.variable.identifier === "scopeName" ||
        operationType === "FunctionDeclaration"
      ) {
        if (!Object.keys(this.space.players).length) this.drawCollinear();
      } else if (variable.type === "string") {
        this.drawRectangle(variable.value.length);
      } else if (variable.type === "number") {
        this.drawPoly(parseInt(variable.value) < 3 ? 3 : variable.value);
      } else if (variable.type === "undefined") {
        this.drawParticle();
      } else if (variable.type === "Array" || variable.type === "ArrayLike") {
        this.drawCurve(variable.value.length);
      } else if (variable.type === "Object") {
        this.drawParticle("object");
      } else if (variable.type === "boolean") {
        if (variable.value === "true") {
          this.drawParticle("true");
        } else {
          this.drawParticle("false");
        }
      }
      this.variable = variable;
    }
  }

  render() {
    return <canvas className={styles.size} ref={c => (this.canvasRef = c)} />;
  }
}

export default PtsCanvas;
