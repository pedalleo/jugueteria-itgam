import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero de bienvenida */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 p-8 text-slate-50 shadow-lg">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
          Bienvenido al panel de Juguetería ITGAM
        </h1>
        <p className="mb-6 max-w-xl text-slate-200">
          Administra el catálogo de juguetes, revisa el inventario y consulta
          las ventas desde un solo lugar.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
          >
            Ir al dashboard
          </Link>
          <Link
            href="/productos"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-900/40"
          >
            Gestionar productos
          </Link>
        </div>
      </section>

      {/* Tarjetas informativas */}
      <section className="mt-2 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-700">
            Catálogo de productos
          </h2>
          <p className="text-sm text-slate-500">
            Crea, edita y elimina juguetes del inventario de la juguetería.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-700">
            Inventario e indicadores
          </h2>
          <p className="text-sm text-slate-500">
            Controla el stock y detecta fácilmente los productos con pocas
            unidades.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-700">
            Reportes y ventas
          </h2>
          <p className="text-sm text-slate-500">
            Visualiza las ventas por mes y el desempeño general desde el
            dashboard.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-700"><strong>Aprendizaje automático de la web</strong></p>
            <div>Proyecto: Panel administrativo</div>
            <div>Versión: 0.1.0</div>
          </div>

          <div className="text-slate-500">
            <div>Autor: Pedro Alejandro</div>
            <div>
              Repositorio:
              <a
                href="https://github.com/pedalleo/jugueteria-itgam"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-sky-600 hover:underline"
              >
                github.com/tu/repo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
