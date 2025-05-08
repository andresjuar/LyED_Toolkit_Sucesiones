function sumaRecursiva(formula, m, n) {
    if (m > n) return 0;//Condición de paro
    const valor = eval(formula.replace(/k/g, `(${m})`));
    return valor + sumaRecursiva(formula, m + 1, n);
}
function multRecursiva(formula, m, n) {
    if (m > n) return 1;
    const valor = eval(formula.replace(/k/g, `(${m})`));
    return valor * multRecursiva(formula, m + 1, n);
}

function latexToJs(latex) {
    return latex
        // Corrige fracciones sin llaves: \fracab → \frac{a}{b}
        .replace(/\\frac(\d+)(\d+)/g, '\\frac{$1}{$2}')

        // Convierte \frac{a}{b} → (a)/(b)
        .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1)/($2)')

        // Corrige multiplicación implícita: (7/2)k → (7/2)*k
        .replace(/\(([^)]+)\/([^)]+)\)k/g, '($1/$2)*k')

        // ak → a*k
        .replace(/([0-9])k/g, '$1*k')

        // Multiplicación explícita \cdot
        .replace(/\\cdot/g, '*')

        // Raíz cuadrada
        .replace(/\\sqrt{([^}]*)}/g, 'Math.sqrt($1)')

        // Paréntesis
        .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')

        // Potencias con llaves: (k+a)^{2} → (k+a)**(2)
        .replace(/(\([^\)]+\)|[a-zA-Z0-9\]])\^\{([^}]+)\}/g, '($1)**($2)')

        // Potencias sin llaves: (k+1)^2 → (k+1)**2
        .replace(/(\([^\)]+\)|[a-zA-Z0-9\]])\^([a-zA-Z0-9\]])/g, '($1)**($2)')

        // Reemplazo de k
        .replace(/k/g, 'k');
}


function procesar() {
    
    // Usamos MathLive para obtener el LaTeX
    const formulaField = document.getElementById('formula'); // es un <math-field>
    const latex = formulaField.getValue(); 
    
    const m = parseInt(document.getElementById('min').value);
    const n = parseInt(document.getElementById('max').value);
    const resultadosDiv = document.getElementById('resultados');
    const sucesion = [];

    resultadosDiv.innerHTML = '';

    if (!latex || isNaN(m) || isNaN(n) || m > n) {
        resultadosDiv.innerHTML = "<p style='color:red;'>Datos inválidos. Asegúrate de llenar todos los campos correctamente.</p>";
        return;
    }

    let formula = latexToJs(latex);

    console.log("Fórumula: ", formula);
    console.log("Latex: ", latex);

    // Calcular términos de la sucesión
    for (let k = m; k <= n; k++) {
        try {
            const valor = eval(formula.replace(/k/g, `(${k})`));
            if (typeof valor !== 'number' || isNaN(valor)) throw "No es un número";
            sucesion.push(valor);
        } catch (error) {
            resultadosDiv.innerHTML = `<p style='color:red;'>Error al evaluar la fórmula en k=${k}. Verifica la fórmula.</p>`;
            return;
        }
    }

    // Mostrar los términos
    let html = `<h3>Fórmula general:</h3>`;
    html += `<p>\\( a_k = ${latex} \\)</p>`;

    html += `<h3>Términos de la sucesión:</h3><ul>`;
    for (let i = 0; i < sucesion.length; i++) {
        const kActual = m + i;
        const latexTerm = latex
            .replace(/(\d|\))k/g, '$1\\cdot ' + kActual)
            .replace(/k/g, kActual);
        html += `<li>\\( a_{${kActual}} = ${latexTerm} = ${sucesion[i].toFixed(6)} \\)</li>`;
    }
    html += `</ul>`;


    // Funciones recursivas

    const suma = sumaRecursiva(formula, m, n);
    const producto = multRecursiva(formula, m, n);


    html += `<h3>Resultados:</h3>`;
    html += `<p>Sumatoria: <strong>${suma.toFixed(6)}</strong></p>`;
    html += `<p>Multiplicación: <strong>${producto.toExponential(6)}</strong></p>`;

    resultadosDiv.innerHTML = html;
    MathJax.typesetPromise();

}
