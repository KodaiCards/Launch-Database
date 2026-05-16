// Net-new — T04.L03 GIS Landbase Creation
// Working lesson: GIS layer stacks, coordinate systems, datums, datum-mismatch detection

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T04.L03',
  course_id: 'T04',
  title: 'GIS Landbase Creation',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T01.L01', 'T04.L01', 'T04.L02'],
  vocabulary_introduced: [
    'landbase',
    'shapefile',
    'geodatabase',
    'coordinate system',
    'datum',
    'UTM',
    'NAD83',
  ],
  key_terms: [
    {
      term: 'landbase',
      definition:
        'The foundational GIS dataset for a project — typically a combination of aerial imagery (or LiDAR planimetric data), property parcel boundaries, road centerlines, and utility-locate layers — onto which the proposed OSP route and all field-collected data are overlaid. The landbase is the shared reference map that everyone on the project team reads from.',
    },
    {
      term: 'shapefile',
      definition:
        'A common GIS file format developed by ESRI that stores one layer of geographic features — points, lines, or polygons — along with attribute data. A shapefile is actually a bundle of at least three related files: the .SHP file (geometry), the .SHX file (index), and the .DBF file (attribute table). Think of a shapefile as a spreadsheet that also knows where things are on a map.',
    },
    {
      term: 'geodatabase',
      definition:
        'A database-structured GIS file format (also ESRI) that can store multiple layers, enforce topology rules, and handle large datasets more reliably than individual shapefiles. For OSP projects with many layers (poles, ducts, splice points, ROW limits, permitting zones), a geodatabase provides better organization and prevents topology errors such as gaps between adjacent parcel polygons.',
    },
    {
      term: 'coordinate system',
      definition:
        'A mathematical framework for assigning (X, Y) or (X, Y, Z) coordinates to locations on the Earth\'s surface. All GIS layers in a project must share the same coordinate system (or be reprojected into one) before they can be overlaid accurately. Mismatch between coordinate systems is the most common cause of "my GPS points don\'t line up with the basemap" errors.',
    },
    {
      term: 'datum',
      definition:
        'The reference model of the Earth\'s shape and size that a coordinate system is built on. NAD83 and WGS84 are the two most common horizontal datums in North America; NAD27 is an older legacy datum. Even if two datasets are both in "geographic coordinates" (latitude and longitude), using different datums can shift their positions by 100–300 feet — enough to place a pole at the wrong address.',
    },
    {
      term: 'UTM',
      definition:
        'Universal Transverse Mercator — a coordinate system that divides the Earth into 60 vertical zones and projects each zone onto a flat plane, producing X/Y coordinates in meters rather than degrees of latitude and longitude. UTM is useful for OSP work because distances and areas in meters are easier to work with than decimal degrees, and the metric units align directly with RUS construction staking intervals.',
    },
    {
      term: 'NAD83',
      definition:
        'North American Datum of 1983 — the current standard horizontal datum for the continental United States, Canada, and Mexico. Established by the National Geodetic Survey (NGS) and expressed in the GRS80 ellipsoid. Most U.S. federal and state GIS datasets, USGS topographic maps, and CORS network corrections reference NAD83. When in doubt, use NAD83 as the project datum.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'photo log', source_lesson_id: 'T04.L01' },
    { term: 'drone', source_lesson_id: 'T04.L02' },
    { term: 'LiDAR', source_lesson_id: 'T04.L02' },
    { term: 'point cloud', source_lesson_id: 'T04.L02' },
    { term: 'planimetric', source_lesson_id: 'T04.L02' },
    { term: 'RTK GNSS', source_lesson_id: 'T04.L02' },
  ],
  estimated_minutes: 25,
};

export default function T04L03_GISLandbaseCoordinateSystems() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          All of your field data — pole locations, hazard flags, photo log GPS points, drone
          imagery — is useless if it doesn't line up on the same map. The <strong>landbase</strong>
          is that common map: the shared foundation that all your layers stack on top of.
          Building it correctly from the start prevents a very specific, very frustrating problem —
          where your GPS points appear 150 feet to the left of the road they're supposed to
          sit on, because two datasets disagree about where the Earth is.
        </p>
        <p className="mt-2">
          Think of a <strong>coordinate system</strong> like a grid drawn on the Earth.
          Every point on the planet gets an (X, Y) address. But different grids were drawn
          at different times by different organizations — some use latitude/longitude in degrees,
          some use meters from a local origin, some use feet from a state-plane origin.
          If you mix data from two grids without knowing it, your poles end up in someone's
          living room on the map, even though you measured them perfectly in the field.
        </p>
        <p className="mt-2">
          The <strong>datum</strong> is the "reference Earth" that the coordinate grid is draped
          over. Two layers can both be in "latitude and longitude" and still not line up if
          one uses NAD83 (the modern U.S. standard) and the other uses NAD27 (the older
          standard from 1927, which is still floating around in legacy county GIS records).
          The mismatch between NAD83 and NAD27 in the southeastern United States can be
          100–300 feet — big enough to place a proposed pole at the wrong property.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GIS</td>
              <td className="px-3 py-2">Geographic Information System</td>
              <td className="px-3 py-2">Software + data that maps spatial layers onto a common reference map</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CRS</td>
              <td className="px-3 py-2">Coordinate Reference System</td>
              <td className="px-3 py-2">The specific combination of datum + projection that defines a layer's coordinate space; shown in the layer's Properties in GIS software</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NAD83</td>
              <td className="px-3 py-2">North American Datum of 1983</td>
              <td className="px-3 py-2">The current standard horizontal datum for U.S. GIS; what most modern county GIS, USGS maps, and CORS corrections reference</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NAD27</td>
              <td className="px-3 py-2">North American Datum of 1927</td>
              <td className="px-3 py-2">Legacy datum; still used in some older county parcel records and paper maps; 100–300 ft offset from NAD83 in the SE United States</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">WGS84</td>
              <td className="px-3 py-2">World Geodetic System 1984</td>
              <td className="px-3 py-2">The global datum used by GPS satellites and Google Maps; nearly identical to NAD83 (within 1–2 m), but technically separate — most modern GIS software treats them as equivalent for general survey work</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">UTM</td>
              <td className="px-3 py-2">Universal Transverse Mercator</td>
              <td className="px-3 py-2">A coordinate system that gives X/Y in meters — easier for field distances than decimal degrees of latitude/longitude</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FGDC</td>
              <td className="px-3 py-2">Federal Geographic Data Committee</td>
              <td className="px-3 py-2">The U.S. federal body that sets metadata standards for geospatial datasets, including the requirement to declare the datum and CRS in dataset metadata</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T04-L03"
          cards={[
            {
              id: 'T04-L03-fc-landbase',
              front: 'What is a landbase in OSP GIS context?',
              back: 'The foundational GIS dataset for a project — typically aerial imagery, property parcel boundaries, road centerlines, and utility-locate layers — onto which the proposed OSP route and all field-collected data are overlaid. The landbase is the shared reference map that everyone on the project team reads from.',
            },
            {
              id: 'T04-L03-fc-shapefile',
              front: 'What is a shapefile?',
              back: 'A common GIS file format that stores one layer of geographic features — points, lines, or polygons — along with attribute data. A shapefile is a bundle of at least three files: .SHP (geometry), .SHX (index), and .DBF (attributes). Think of it as a spreadsheet that also knows where things are on a map.',
            },
            {
              id: 'T04-L03-fc-geodatabase',
              front: 'What is a geodatabase?',
              back: 'A database-structured GIS file format that can store multiple layers, enforce topology rules, and handle large datasets more reliably than individual shapefiles. For OSP projects with many layers, a geodatabase provides better organization and prevents topology errors.',
            },
            {
              id: 'T04-L03-fc-coordinate-system',
              front: 'What is a coordinate system in GIS?',
              back: 'A mathematical framework for assigning (X, Y) or (X, Y, Z) coordinates to locations on the Earth\'s surface. All GIS layers must share the same coordinate system (or be reprojected) before they can be overlaid accurately. Mismatch between coordinate systems is the most common cause of GPS-to-basemap misalignment.',
            },
            {
              id: 'T04-L03-fc-datum',
              front: 'What is a datum and why does it matter for OSP surveys?',
              back: 'The reference model of the Earth\'s shape and size that a coordinate system is built on. Even if two datasets are both in latitude/longitude, using different datums (NAD83 vs. NAD27) can shift positions by 100–300 feet — enough to place a pole at the wrong address. Always declare and verify the datum for every layer before overlaying.',
            },
            {
              id: 'T04-L03-fc-utm',
              front: 'What is UTM and why is it useful for OSP work?',
              back: 'Universal Transverse Mercator — a coordinate system that divides the Earth into 60 vertical zones and uses X/Y coordinates in meters. UTM is useful for OSP work because distances in meters align with RUS construction staking intervals and are easier to work with than decimal degrees of latitude/longitude.',
            },
            {
              id: 'T04-L03-fc-nad83',
              front: 'What is NAD83?',
              back: 'North American Datum of 1983 — the current standard horizontal datum for the continental United States. References the GRS80 ellipsoid. Most U.S. federal and state GIS datasets, USGS maps, and CORS network corrections use NAD83. When in doubt, use NAD83 as the project datum.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Building the GIS Landbase</h2>

        <h3 className="mt-4 font-semibold">The layer stack — what goes in the landbase</h3>
        <p>
          An OSP project landbase is assembled from multiple data sources in a specific
          trust hierarchy — more accurate data on top, less accurate below. Typical layers
          from least to most trusted:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-3 text-sm">
          <li>
            <strong>Aerial imagery base (lowest geometric accuracy).</strong>
            Satellite or aircraft imagery from county GIS portals, Google, or USDA NAIP.
            Useful for visual reference but may have 1–5 m geometric error depending on the
            acquisition and orthorectification quality. Never use aerial imagery as the
            sole basis for precise pole-location measurements.
          </li>
          <li>
            <strong>County parcel / property boundary layer.</strong>
            Parcel polygons from the county tax assessor's GIS portal. Usually in NAD83,
            but always confirm — some rural counties still publish in NAD27.
            Accuracy varies: urban counties often have 1–3 ft parcel accuracy; rural counties
            may have 10–30 ft accuracy where boundary descriptions haven't been re-surveyed.
          </li>
          <li>
            <strong>Utility-locate / atlas layer.</strong>
            Records of existing buried or aerial utilities, from the one-call center's
            facility atlas or the utility company's GIS export. Accuracy is widely variable —
            some utilities have GPS-accurate records; older pencil-drawn atlas maps are
            approximate. Treat as "guidance" and confirm with 811 locate before any excavation.
          </li>
          <li>
            <strong>LiDAR planimetric layer or drone-captured imagery (high accuracy).</strong>
            RTK-corrected drone data or LiDAR-derived planimetrics have horizontal accuracy
            of 1–3 cm when properly processed (per NOAA NGS CORS documentation).
            This is the most accurate layer — it forms the geometric foundation that other
            layers snap to. When the county parcel boundary and the drone imagery disagree
            on where a road centerline is, trust the drone data.
          </li>
          <li>
            <strong>Field GPS survey points (highest accuracy).</strong>
            RTK GNSS-collected pole locations and route points captured by the field crew.
            Sub-decimeter accuracy. These become the anchor points for the design drawing.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Coordinate systems and datums — practical workflow</h3>
        <p>
          When you open a GIS project and add a new layer, the software usually tries to
          auto-detect the layer's coordinate system. Always verify it manually rather than
          trusting the auto-detect. In QGIS or ArcGIS:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>Right-click the layer → Properties → Source (QGIS) or Source tab (ArcGIS).</li>
          <li>Read the CRS description. Look for the datum name: "NAD83," "WGS 84," "NAD27," or "Unknown."</li>
          <li>If the datum shows "Unknown" or "NAD27," do not overlay it with your NAD83 data without reprojecting first.</li>
          <li>To reproject: use the "Reproject Layer" tool (QGIS) or "Project Raster/Feature" tool (ArcGIS) to convert the layer to your project CRS (typically NAD83 / UTM Zone 17N for Georgia, for example).</li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field — NAD83 vs. NAD27 Datum Mismatch</p>
          <p className="text-slate-300/90">
            <strong>Book (FGDC metadata standards):</strong> All geospatial datasets must declare
            the horizontal datum (NAD83, WGS84, NAD27) and coordinate reference system (CRS)
            explicitly in dataset metadata. GIS interoperability assumes both layers share the
            same CRS or are reprojected before overlay. This is not optional for any dataset
            submitted to a federal or state agency.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Handheld GPS units (older Garmin units, entry-level
            Trimble receivers) sometimes default to WGS84 while the project basemap is
            projected in NAD27 or a legacy state-plane system. The positional error between
            WGS84/NAD83 and NAD27 can reach 100–300 feet on a basemap/GPS mismatch —
            large enough to place a proposed pole at the wrong address. Many crews don't notice
            until the designer's CAD overlay shows poles sitting in the middle of a creek instead
            of on the road shoulder. By then, re-collecting the GPS points may mean another
            field trip.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>How to detect a datum mismatch in the field:</strong> After uploading your
            first batch of GPS points to the GIS project, spot-check 3–5 points against the
            aerial imagery. Each GPS point should land within 1–3 feet of the feature it
            represents (a pole butt, a manhole cover, a road intersection). If the point lands
            visibly off the road or 100+ feet from the feature, you have a datum mismatch.
            Correct the GPS unit's output datum before continuing data collection.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk:</strong> A design drawn on a mismatched GIS layer will have
            poles in the wrong locations — which becomes apparent during construction when
            the stake doesn't line up with the property line or the road centerline. Correcting
            in the field during construction is far more expensive than catching the mismatch
            during the survey stage.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">UTM zones — computing your zone from longitude</h3>
        <p>
          If your project deliverable calls for UTM coordinates (many RUS and USDA datasets do),
          you need to know which UTM zone your route falls in. The formula:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          UTM Zone = floor((longitude + 180) / 6) + 1
        </div>
        <p className="text-sm text-slate-300/80">
          Where <em>longitude</em> is the decimal-degree longitude of the project centroid
          (negative for western hemisphere).
        </p>
        <p className="mt-2 text-sm">
          <strong>Example — Macon, GA (longitude ≈ −83.6°):</strong>
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-2">
          <div>Step 1: −83.6 + 180 = 96.4</div>
          <div>Step 2: 96.4 / 6 = 16.07</div>
          <div>Step 3: floor(16.07) = 16</div>
          <div>Step 4: 16 + 1 = <span className="text-green-400 font-bold">UTM Zone 17</span></div>
        </div>
        <p className="text-sm text-slate-300/70">
          Sanity check: UTM Zone 17N covers the eastern United States including Georgia,
          South Carolina, North Carolina, and portions of Tennessee and Virginia.
          Most OSP work in central Georgia uses "NAD83 / UTM Zone 17N" as the project CRS.
          Source: USGS National Geodetic Survey coordinate reference system documentation
          (ngs.noaa.gov).
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Geodatabase topology — why it matters for large OSP projects</h3>
        <p>
          For a multi-mile OSP build with hundreds of pole locations, splice points, duct segments,
          and ROW boundaries, using individual shapefiles for each layer quickly becomes
          unmanageable. A <strong>geodatabase</strong> (ESRI file geodatabase or enterprise
          geodatabase) enforces topology rules that prevent data quality errors:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li><strong>"Must not have gaps"</strong> rule on the ROW polygon layer — ensures the ROW boundary is a continuous closed polygon, not a series of disconnected segments with invisible gaps that could let a parcel fall outside the ROW on paper.</li>
          <li><strong>"Must be covered by"</strong> rule — ensures every duct segment is within the ROW boundary. Catches design errors where a duct line was accidentally drawn outside the project footprint.</li>
          <li><strong>"Must not overlap"</strong> rule on pole point layer — prevents duplicate poles at the same coordinate, which often happen when two technicians independently add the same pole from different GPS sessions.</li>
        </ul>
        <p className="mt-2">
          For small projects (under 5 miles, single crew), individual shapefiles are fine.
          For regional projects (10+ miles, multiple field crews, multiple design iterations),
          a geodatabase pays for its setup complexity in data quality and version-control benefits.
        </p>

        <h3 className="mt-5 font-semibold">The vertical datum — NAVD88</h3>
        <p>
          Everything in this lesson has covered horizontal datums (where things are in X and Y).
          When elevation matters — sag calculations, flood-zone analysis, river-crossing clearance —
          you also need a vertical datum. The current standard vertical datum for the continental
          United States is <strong>NAVD88</strong> (North American Vertical Datum of 1988),
          defined by NOAA NGS. Most drone LiDAR products deliver elevations referenced to
          NAVD88 or to the WGS84 ellipsoid (which needs a geoid correction to convert to NAVD88).
        </p>
        <p className="mt-2">
          For T04 scope (field data collection), you don't need to calculate geoid corrections —
          that's a GIS post-processing step. The takeaway: when you order a LiDAR survey, specify
          "deliver elevations in NAVD88" in the scope so the GIS team doesn't have to
          re-process the data after delivery.
        </p>
      </section>

      {/* ── GIS LAYER ACCURACY LADDER ───────────────────────────────────── */}
      <div className="lesson-callout">
        <h4>GIS Layer Trust Hierarchy — Accuracy Ladder (Least to Most Accurate)</h4>
        <p>In an OSP route landbase, not all data sources are created equal. Here are the five common layers ranked from least to most geometrically trusted:</p>
        <ol>
          <li>
            <strong>Aerial Imagery Base (least trusted)</strong> — County GIS or satellite imagery. Useful for visual context but has 1–5 m geometric error. Never use as the sole basis for precise pole measurements. Primary use: background for visual checks and stakeholder presentation maps.
          </li>
          <li>
            <strong>County Parcel Boundaries</strong> — Property boundary polygons from the county tax assessor's GIS portal. Usually in NAD83 — always verify the coordinate system. Accuracy varies from 1–3 ft (well-surveyed urban) to 10–30 ft (rural). Critical for identifying ROW vs. private land and triggering easement requirements.
          </li>
          <li>
            <strong>Utility Locate / Atlas Layer</strong> — Records of existing buried or aerial utilities. Accuracy is highly variable — treat as guidance, not design truth. Confirm with 811 locate before any excavation. Source: one-call center facility atlas or utility company GIS export.
          </li>
          <li>
            <strong>LiDAR Planimetric / Drone Imagery (RTK-corrected)</strong> — RTK-corrected drone data or LiDAR-derived planimetrics. Horizontal accuracy 1–3 cm when properly processed (NOAA NGS CORS documentation). This is the geometric foundation. When county parcel data and drone imagery disagree on road centerline location, trust the drone data.
          </li>
          <li>
            <strong>RTK GNSS Field Points (most trusted)</strong> — Pole locations and route points collected with RTK GNSS by the field crew. Sub-decimeter accuracy. These are the anchor points for the design drawing. Every other layer should snap to these points — not the other way around.
          </li>
        </ol>
      </div>

      {/* ── SORTABLE ─────────────────────────────────────────────────────── */}
      <Sortable
        title="Rank GIS Data Sources by Geometric Trust Level"
        description="Drag these data sources into order from LEAST trusted (top) to MOST trusted (bottom) for use as pole-location references in an OSP design drawing."
        items={[
          { id: 'satellite-imagery', label: 'Commercial satellite imagery (Google Maps screenshot)' },
          { id: 'county-parcel', label: 'County tax-assessor parcel GIS (NAD83, no stated accuracy)' },
          { id: 'utility-atlas', label: 'One-call utility atlas (pencil-drawn records from the 1980s)' },
          { id: 'drone-rtk', label: 'RTK-corrected drone orthophoto (cm-level accuracy certified)' },
          { id: 'field-rtk', label: 'RTK GNSS field-measured pole coordinates (sub-decimeter)' },
        ]}
        correctOrder={['satellite-imagery', 'utility-atlas', 'county-parcel', 'drone-rtk', 'field-rtk']}
        feedbackCorrect="Correct. Field RTK GNSS is the most trusted (sub-decimeter accuracy). Drone RTK orthophoto is next (cm-level certified). County parcel GIS varies but is better than utility atlas sketches. Utility atlases (especially legacy paper-scanned records) are guidance only. Raw satellite screenshots have uncontrolled geometry and should never be used as a design reference."
        feedbackIncorrect="Not quite. Think about which sources have certified, verifiable accuracy versus which ones are estimates or legacy records. Field RTK GNSS → Drone RTK ortho → County parcel GIS → Utility atlas → Satellite imagery (least trusted, most uncertain geometry)."
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T04.L03 Check — GIS Landbase and Coordinate Systems"
        mode="multiple-choice"
        questions={[
          {
            id: 'T04-L03-Q1',
            type: 'mc',
            prompt:
              'After uploading your field GPS pole locations to the GIS project, you notice that the points land approximately 200 feet west of where the poles actually are on the aerial imagery. What is the most likely cause?',
            choices: [
              'The aerial imagery was captured on a cloudy day and has color distortion',
              'A datum mismatch — the GPS unit recorded in NAD27 while the project basemap is in NAD83 (or vice versa)',
              'The GPS antenna was mounted on the wrong side of the vehicle',
              'The pole numbering sequence was entered incorrectly in the field notebook',
            ],
            answerIndex: 1,
            explanation:
              'A 100–300 ft systematic offset between GPS points and the basemap is the classic signature of a datum mismatch — most commonly NAD83 vs. NAD27. Both datasets use latitude and longitude, but they define the origin and scale of the Earth differently, producing a consistent spatial offset. The fix is to determine which datum the GPS unit was recording in and reproject the data to match the basemap.',
          },
          {
            id: 'T04-L03-Q2',
            type: 'mc',
            prompt:
              'A shapefile for a "Poles" layer consists of three files: Poles.SHP, Poles.SHX, and Poles.DBF. You accidentally delete the .DBF file. What is lost?',
            choices: [
              'The geometry — the software can no longer display the pole locations on the map',
              'The spatial index — the layer will still display but will open slowly',
              'The attribute table — pole numbers, heights, and all other tabular data attached to each point are gone',
              'The coordinate system definition — all poles will appear at location (0, 0)',
            ],
            answerIndex: 2,
            explanation:
              'The .DBF file is the dBASE IV attribute table that stores all non-geometric data attached to each feature — pole numbers, heights, attachment counts, ownership, and any other fields. The .SHP holds the geometry (X, Y coordinates). The .SHX holds the spatial index. Deleting .DBF means the poles will still display on the map but all attribute information is gone — you\'d see points with no labels or data.',
          },
          {
            id: 'T04-L03-Q3',
            type: 'fill-in-blank',
            prompt:
              'The reference model of the Earth\'s shape and size that a coordinate system is built on is called the ____.',
            answer: 'datum',
            answerDisplay: 'datum',
            explanation:
              'The datum defines the reference ellipsoid and origin for a coordinate system. NAD83 and WGS84 are modern datums; NAD27 is the legacy U.S. datum. Mixing layers with different datums without reprojection causes positional errors of 100–300 feet in the southeastern United States.',
          },
          {
            id: 'T04-L03-Q4',
            type: 'mc',
            prompt:
              'Your project is centered at longitude −88.5° (Mississippi). Using the formula UTM Zone = floor((longitude + 180) / 6) + 1, which UTM zone is correct?',
            choices: [
              'Zone 14',
              'Zone 15',
              'Zone 16',
              'Zone 17',
            ],
            answerIndex: 2,
            explanation:
              'Step 1: −88.5 + 180 = 91.5. Step 2: 91.5 / 6 = 15.25. Step 3: floor(15.25) = 15. Step 4: 15 + 1 = 16. Zone 16 covers longitude −84° to −90°, which includes central and southern Mississippi. Zone 15 covers −90° to −96° (Louisiana west of the Mississippi River and Texas east); Zone 17 covers −78° to −84° (western Georgia, Tennessee). The correct answer for longitude −88.5° is Zone 16.',
            fieldNote:
              'Mississippi lies in UTM Zone 16 (longitude −84° to −90°). This zone covers central and southern Mississippi, Alabama, parts of Tennessee, and western Florida. Most OSP work in central Mississippi uses "NAD83 / UTM Zone 16N" as the project CRS. Source: USGS NGS coordinate reference system documentation (ngs.noaa.gov).',
          },
        ]}
      />

    </LessonLayout>
  );
}
