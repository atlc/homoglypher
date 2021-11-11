import React, { useState } from "react";
import Swal from "sweetalert2";
import { homoglyphs } from "./letters";

/**
 * Built utilizing the homoglyph library compiled here
 * https://gist.github.com/StevenACoffman/a5f6f682d94e38ed804182dc2693ed4b
 *
 */

const RANDOM_THRESHOLD = 50;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

const App = () => {
    const [rawText, setRawText] = useState("");
    const [glyphs, setGlyphs] = useState("");
    const [sensitivity, setSensitivity] = useState(100);

    const generateGlyphs = raw => {
        const glyphed = raw
            .split("")
            .map(char => {
                const letter = char.toLowerCase();
                const possible_substitutes = homoglyphs[letter];
                const should_be_randomized = Math.random() * sensitivity >= RANDOM_THRESHOLD * 0.5;

                if (possible_substitutes && should_be_randomized) {
                    const random_sub = possible_substitutes[Math.floor(Math.random() * possible_substitutes.length)];
                    return random_sub;
                }

                return char;
            })
            .join("");
        setGlyphs(glyphed);
    };

    const handleSlider = e => {
        setSensitivity(e.target.value);
        generateGlyphs(rawText);
    };

    const handleTextUpdate = e => {
        const raw = e.target.value;
        setRawText(raw);
        generateGlyphs(raw);
    };

    const copy = async () => {
        if (!glyphs) return;
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(glyphs);

                Toast.fire({ title: "Successfully copied to your clipboard!" });
            }
        } catch (e) {
            Swal.fire({
                title: "Unable to copy automatically to your clipboard!",
                icon: "error",
                text: glyphs
            });
        }
    };

    return (
        <div className="container">
            <div className="mt-5 justify-content-center shadow-lg">
                <form className="px-5 py-3 bg-light rounded-3 shadow-lg">
                    <div className="row justify-content-center">
                        <div className="col-11 col-md-4 bg-white shadow rounded-3 my-2 py-1 px-4">
                            <p className="text-dark">Sensitivity: {sensitivity}/100</p>
                            <input
                                step={5}
                                max={100}
                                min={25}
                                value={sensitivity}
                                onChange={handleSlider}
                                type="range"
                                className="form-range"
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div onClick={copy} className="col-12 col-md-6 my-2">
                            <label htmlFor="" className="text-dark">
                                Output (click to copy)
                            </label>
                            <textarea
                                value={glyphs}
                                style={{ resize: "none" }}
                                cols="30"
                                rows="6"
                                readOnly
                                className="form-control"></textarea>
                        </div>
                        <div className="col-12 col-md-6 my-2">
                            <label className="text-dark">Input your text here:</label>
                            <textarea
                                value={rawText}
                                onChange={handleTextUpdate}
                                style={{ resize: "none" }}
                                placeholder="Input your text to convert it to a mix of unicode characters to avoid simple word recognition."
                                cols="30"
                                rows="6"
                                className="form-control shadow"></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
