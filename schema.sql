--
--

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

--
-- Name: sync_projected_revenue_footage(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_projected_revenue_footage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Only act on footage billing_type rows.
  -- ARC-3: when expected_revenue changes on a footage project, keep
  -- projected_revenue in lock-step. This prevents the stale-projected_revenue
  -- data quality issue (Auditor C-3): footage edited but projected not updated.
  IF NEW.billing_type = 'footage' AND (
    OLD.expected_revenue IS DISTINCT FROM NEW.expected_revenue
    OR OLD.billing_type IS DISTINCT FROM NEW.billing_type
  ) THEN
    NEW.projected_revenue := NEW.expected_revenue;
  END IF;
  RETURN NEW;
END;
$$;

--
-- Name: ai_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: billing_batch_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_batch_items (
    batch_id uuid NOT NULL,
    project_id uuid NOT NULL,
    snapshot_amount numeric(14,2),
    snapshot_period_year integer,
    snapshot_period_month integer
);

--
-- Name: billing_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_batches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(160) NOT NULL,
    client_id uuid,
    engineering_contract_id uuid,
    job_id uuid,
    period_start date,
    period_end date,
    total_amount numeric(14,2) DEFAULT 0,
    notes text,
    created_by_user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: budget_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.budget_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    budget_id uuid,
    code character varying(100) NOT NULL,
    description character varying(255),
    allocated_amount numeric(14,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    job_id uuid
);

--
-- Name: budgets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.budgets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    engineering_contract_id uuid,
    name character varying(200) NOT NULL,
    total_amount numeric(14,2) DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT budget_scope_exactly_one CHECK (((((project_id IS NOT NULL))::integer + ((engineering_contract_id IS NOT NULL))::integer) = 1))
);

--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    show_contract boolean,
    show_work_order boolean
);

--
-- Name: concentrators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concentrators (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_label character varying(100) NOT NULL,
    area_name character varying(200) NOT NULL,
    work_order_number character varying(100),
    active boolean DEFAULT true,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid,
    engineering_contract_id uuid,
    contract_number character varying(50) NOT NULL,
    name character varying(200),
    friendly_label character varying(40),
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: customer_clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_clients (
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: design_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.design_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    stage character varying(50) NOT NULL,
    completed_at timestamp with time zone,
    notes text,
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: ec_service_areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ec_service_areas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    engineering_contract_id uuid NOT NULL,
    name text NOT NULL,
    notes text,
    work_order_number text,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: ec_work_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ec_work_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    engineering_contract_id uuid NOT NULL,
    service_area_id uuid,
    number text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: ec_job_visibility; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ec_job_visibility (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    engineering_contract_id uuid NOT NULL,
    job_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id uuid
);

--
-- Name: engineering_contracts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.engineering_contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid,
    name character varying(255) NOT NULL,
    contract_number character varying(80),
    loan_name character varying(80),
    notes text,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    program character varying(20),
    CONSTRAINT engineering_contracts_program_check CHECK (((program IS NULL) OR ((program)::text = ANY ((ARRAY['rus'::character varying, 'bau'::character varying, 'gfr'::character varying, 'other'::character varying])::text[]))))
);

--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    project_id uuid,
    description text NOT NULL,
    quantity numeric(10,3),
    unit character varying(20),
    rate numeric(10,2),
    amount numeric(12,2),
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: invoice_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    job_id uuid,
    client_id uuid,
    name character varying(160),
    reference_pdf_path text,
    reference_pdf_filename character varying(260),
    generated_html text,
    notes text,
    analysis_status character varying(20) DEFAULT 'pending'::character varying,
    analysis_error text,
    analyzed_at timestamp with time zone,
    created_by_user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid,
    invoice_number character varying(100),
    invoice_date date,
    billing_period_start date,
    billing_period_end date,
    total_amount numeric(12,2) DEFAULT 0,
    status character varying(50) DEFAULT 'draft'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: job_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    job_id uuid NOT NULL,
    client_id uuid,
    engineering_contract_id uuid,
    team text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT job_assignments_at_least_one_scope CHECK (((client_id IS NOT NULL) OR (engineering_contract_id IS NOT NULL) OR (team IS NOT NULL)))
);

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    default_billing_type character varying(20) DEFAULT 'hourly'::character varying,
    default_rate numeric(10,2),
    is_permitting boolean DEFAULT false,
    active boolean DEFAULT true,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    team character varying(20),
    billing_code character varying(40),
    for_psc_client boolean DEFAULT true,
    for_generic_client boolean DEFAULT true,
    manually_overridden_at timestamp with time zone,
    program_scope character varying(20),
    CONSTRAINT jobs_program_scope_check CHECK (((program_scope IS NULL) OR ((program_scope)::text = ANY ((ARRAY['rus'::character varying, 'non_rus'::character varying, 'shared'::character varying])::text[]))))
);

--
-- Name: permit_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permit_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    doc_type character varying(50) NOT NULL,
    file_name character varying(255),
    file_path text,
    file_size integer,
    revision_number integer DEFAULT 1,
    uploaded_by character varying(100),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    uploaded_by_user_id uuid
);

--
-- Name: permit_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permit_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    stage character varying(50) NOT NULL,
    completed_at timestamp with time zone,
    notes text,
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: potential_permits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.potential_permits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sr_hwy character varying(200),
    county character varying(200),
    route character varying(200),
    notes text,
    status character varying(50) DEFAULT 'pending'::character varying,
    submitted_by character varying(100),
    reviewed_by character varying(100),
    project_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- Name: pricing_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    job_id uuid,
    billing_code character varying(100),
    billing_type character varying(20) DEFAULT 'hourly'::character varying,
    rate numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    program character varying(20),
    CONSTRAINT pricing_entries_program_check CHECK (((program IS NULL) OR ((program)::text = ANY ((ARRAY['rus'::character varying, 'bau'::character varying, 'gfr'::character varying, 'other'::character varying])::text[]))))
);

--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_id uuid,
    name character varying(200) NOT NULL,
    client_id uuid,
    contract_id uuid,
    engineering_contract_id uuid,
    work_order_number character varying(100),
    project_type character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'active'::character varying,
    billing_type character varying(20) DEFAULT 'hourly'::character varying NOT NULL,
    billing_rate numeric(10,2),
    footage numeric(10,2),
    miles numeric(10,4),
    expected_hours numeric(12,4),
    expected_revenue numeric(10,2),
    actual_hours numeric(12,4) DEFAULT 0,
    actual_revenue numeric(10,2) DEFAULT 0,
    start_date date,
    completed_date date,
    billed_date date,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    budget_code_id uuid,
    concentrator_id uuid,
    bill_hold_until date,
    job_id uuid,
    permitting_hours_per_mile numeric(6,2),
    billing_cadence character varying(20) DEFAULT 'one_time'::character varying,
    projected_revenue numeric(14,2),
    manual_invoice_amount numeric(14,2),
    permit_subtype character varying(20),
    is_rollup boolean DEFAULT false,
    rollup_level character varying(20),
    rollup_key text,
    created_by_user_id uuid,
    updated_by_user_id uuid,
    is_ongoing boolean DEFAULT false,
    program character varying(20),
    service_area_name text,
    CONSTRAINT projects_program_check CHECK (((program IS NULL) OR ((program)::text = ANY ((ARRAY['rus'::character varying, 'bau'::character varying, 'gfr'::character varying, 'other'::character varying])::text[]))))
);

--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    filename character varying(255) NOT NULL,
    applied_at timestamp with time zone DEFAULT now(),
    checksum character varying(64)
);

--
-- Name: setting_change_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting_change_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type character varying(30) NOT NULL,
    action character varying(20) NOT NULL,
    entity_id uuid,
    payload jsonb NOT NULL,
    current_snapshot jsonb,
    source_portal character varying(20) NOT NULL,
    proposed_by character varying(100),
    status character varying(20) DEFAULT 'pending'::character varying,
    reviewed_by character varying(100),
    reviewed_at timestamp with time zone,
    review_notes text,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: splice_buffer_tubes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_buffer_tubes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cable_id uuid NOT NULL,
    "position" integer NOT NULL,
    color character varying(20) NOT NULL
);

--
-- Name: splice_cable_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_cable_states (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cable_id uuid NOT NULL,
    location_id uuid NOT NULL,
    slack_length_inches integer,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT splice_cable_states_slack_length_inches_check CHECK (((slack_length_inches IS NULL) OR (slack_length_inches >= 0)))
);

--
-- Name: splice_cables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_cables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    name character varying(120) NOT NULL,
    fiber_count integer NOT NULL,
    construction_type character varying(20) NOT NULL,
    from_location_id uuid,
    to_location_id uuid,
    manufacturer_part character varying(120),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    path_geojson jsonb,
    tube_size_fibers integer DEFAULT 12 NOT NULL,
    category character varying(20) DEFAULT 'unclassified'::character varying NOT NULL,
    CONSTRAINT splice_cables_category_check CHECK (((category)::text = ANY ((ARRAY['backbone'::character varying, 'lateral'::character varying, 'drop'::character varying, 'pigtail'::character varying, 'conduit'::character varying, 'legacy'::character varying, 'unclassified'::character varying])::text[]))),
    CONSTRAINT splice_cables_construction_type_check CHECK (((construction_type)::text = ANY ((ARRAY['ribbon'::character varying, 'loose_tube'::character varying, 'central_tube'::character varying, 'micromodule'::character varying, 'rollable_ribbon'::character varying])::text[]))),
    CONSTRAINT splice_cables_fiber_count_check CHECK ((fiber_count = ANY (ARRAY[6, 12, 24, 36, 48, 72, 96, 144, 216, 288, 432, 576, 864, 1152, 1728, 3456]))),
    CONSTRAINT splice_cables_tube_size_fibers_check CHECK ((tube_size_fibers = ANY (ARRAY[6, 12, 24])))
);

--
-- Name: splice_closure_models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_closure_models (
    model character varying(120) NOT NULL,
    default_tray_count integer DEFAULT 6 NOT NULL,
    default_tray_capacity integer DEFAULT 12 NOT NULL,
    use_count integer DEFAULT 1 NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: splice_closure_public_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_closure_public_tokens (
    token character varying(64) NOT NULL,
    closure_id uuid NOT NULL,
    project_id uuid NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_staff_id uuid
);

--
-- Name: splice_closure_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_closure_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(120) NOT NULL,
    scope_client_id uuid,
    model character varying(120),
    tray_count integer DEFAULT 6 NOT NULL,
    tray_capacity integer DEFAULT 12 NOT NULL,
    default_splices_jsonb jsonb,
    notes text,
    created_by_staff_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    published_at timestamp with time zone,
    published_by_staff_id uuid,
    download_count integer DEFAULT 0 NOT NULL,
    CONSTRAINT splice_closure_templates_tray_capacity_check CHECK ((tray_capacity > 0)),
    CONSTRAINT splice_closure_templates_tray_count_check CHECK ((tray_count > 0))
);

--
-- Name: splice_closures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_closures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid NOT NULL,
    model character varying(120),
    tray_count integer DEFAULT 6 NOT NULL,
    tray_capacity integer DEFAULT 12 NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT splice_closures_tray_capacity_check CHECK ((tray_capacity > 0)),
    CONSTRAINT splice_closures_tray_count_check CHECK ((tray_count > 0))
);

--
-- Name: splice_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    target_table character varying(40) NOT NULL,
    target_id uuid NOT NULL,
    body text NOT NULL,
    created_by_user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone,
    resolved_by_user_id uuid,
    parent_comment_id uuid
);

--
-- Name: splice_custom_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_custom_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    layer_id uuid NOT NULL,
    project_id uuid NOT NULL,
    geometry_json jsonb NOT NULL,
    attributes_jsonb jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(120)
);

--
-- Name: splice_custom_layers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_custom_layers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    name character varying(80) NOT NULL,
    geometry_type character varying(10) NOT NULL,
    default_style jsonb DEFAULT '{"color": "#6366F1"}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT splice_custom_layers_geometry_type_check CHECK (((geometry_type)::text = ANY ((ARRAY['point'::character varying, 'line'::character varying, 'polygon'::character varying])::text[])))
);

--
-- Name: splice_design_import_changes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_design_import_changes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_id uuid NOT NULL,
    change_type character varying(20) NOT NULL,
    target_table character varying(40) NOT NULL,
    target_id uuid,
    payload_jsonb jsonb NOT NULL,
    decision character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    decision_at timestamp with time zone,
    decision_by_staff_id uuid,
    decision_comment text,
    applied_at timestamp with time zone,
    applied_target_id uuid,
    CONSTRAINT splice_design_import_changes_change_type_check CHECK (((change_type)::text = ANY ((ARRAY['add'::character varying, 'update'::character varying, 'delete'::character varying])::text[]))),
    CONSTRAINT splice_design_import_changes_decision_check CHECK (((decision)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'skipped'::character varying])::text[])))
);

--
-- Name: splice_design_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_design_imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    source_filename character varying(300),
    source_format character varying(20) NOT NULL,
    source_size_bytes integer,
    source_bytes bytea,
    uploaded_by_staff_id uuid,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    decision_at timestamp with time zone,
    decision_by_staff_id uuid,
    summary_jsonb jsonb,
    dxf_calibration_jsonb jsonb,
    notes text,
    CONSTRAINT splice_design_imports_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'applied'::character varying, 'partially_applied'::character varying, 'rejected'::character varying])::text[])))
);

--
-- Name: splice_fibers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_fibers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    buffer_tube_id uuid NOT NULL,
    "position" integer NOT NULL,
    color character varying(20) NOT NULL,
    circuit_name character varying(120),
    customer character varying(120),
    notes text,
    CONSTRAINT splice_fibers_position_check CHECK ((("position" >= 1) AND ("position" <= 24)))
);

--
-- Name: splice_field_markups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_field_markups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    closure_id uuid NOT NULL,
    project_id uuid NOT NULL,
    token character varying(64),
    splicer_name character varying(120),
    notes text,
    mime_type character varying(80) NOT NULL,
    byte_size integer NOT NULL,
    image_data bytea NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    uploader_ip character varying(45)
);

--
-- Name: splice_layer_styles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_layer_styles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    layer_id character varying(80) NOT NULL,
    style_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: splice_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    type character varying(20) NOT NULL,
    name character varying(120) NOT NULL,
    sequence_index integer DEFAULT 0 NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    CONSTRAINT splice_locations_type_check CHECK (((type)::text = ANY ((ARRAY['co'::character varying, 'splice_point'::character varying, 'fdh'::character varying, 'terminal'::character varying, 'ring_cut'::character varying, 'handhole'::character varying, 'manhole'::character varying, 'pole'::character varying, 'pedestal'::character varying, 'vault'::character varying])::text[])))
);

--
-- Name: splice_loss_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_loss_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    splice_id uuid,
    closure_id uuid,
    location_id uuid,
    source character varying(40) DEFAULT 'fujikura_splice_plus'::character varying NOT NULL,
    splicer_serial character varying(120),
    operator_name character varying(120),
    splice_loss_db numeric(5,3),
    measured_at timestamp with time zone,
    gps_lat numeric(10,7),
    gps_lon numeric(10,7),
    bind_method character varying(20),
    raw_payload_jsonb jsonb NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    uploaded_by_user_id uuid,
    field_token character varying(64)
);

--
-- Name: splice_project_public_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_project_public_tokens (
    token character varying(64) NOT NULL,
    project_id uuid NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_staff_id uuid,
    label character varying(200)
);

--
-- Name: splice_project_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_project_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    version_number integer NOT NULL,
    snapshot_jsonb jsonb NOT NULL,
    generation_hash character varying(16),
    label character varying(200),
    created_by_staff_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: splice_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(200) NOT NULL,
    designer_id uuid,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    notes text,
    locked_by_staff_id uuid,
    locked_by_name character varying(120),
    locked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT splice_projects_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'completed'::character varying, 'archived'::character varying])::text[])))
);

--
-- Name: splice_ribbon_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_ribbon_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tray_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: splice_splitter_outputs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_splitter_outputs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    splitter_id uuid NOT NULL,
    "position" integer NOT NULL,
    output_fiber_id uuid,
    CONSTRAINT splice_splitter_outputs_position_check CHECK (("position" >= 1))
);

--
-- Name: splice_splitters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_splitters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    closure_id uuid NOT NULL,
    ratio character varying(10) NOT NULL,
    input_fiber_id uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT splice_splitters_ratio_check CHECK (((ratio)::text = ANY ((ARRAY['1x2'::character varying, '1x4'::character varying, '1x8'::character varying, '1x16'::character varying, '1x32'::character varying, '1x64'::character varying])::text[])))
);

--
-- Name: splice_strand_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_strand_states (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cable_id uuid NOT NULL,
    location_id uuid NOT NULL,
    strand_position integer NOT NULL,
    state character varying(20) NOT NULL,
    stored_length_inches integer,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT splice_strand_states_state_check CHECK (((state)::text = ANY ((ARRAY['express'::character varying, 'spliced'::character varying, 'stored'::character varying])::text[]))),
    CONSTRAINT splice_strand_states_stored_length_inches_check CHECK (((stored_length_inches IS NULL) OR (stored_length_inches >= 0))),
    CONSTRAINT splice_strand_states_strand_position_check CHECK (((strand_position >= 1) AND (strand_position <= 864)))
);

--
-- Name: splice_trays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splice_trays (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    closure_id uuid NOT NULL,
    "position" integer NOT NULL
);

--
-- Name: splices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.splices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tray_id uuid,
    fiber_a_id uuid NOT NULL,
    fiber_b_id uuid NOT NULL,
    splice_type character varying(20) DEFAULT 'fusion'::character varying NOT NULL,
    ribbon_group_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    closure_id uuid,
    location_id uuid,
    CONSTRAINT chk_splice_anchor CHECK (((tray_id IS NOT NULL) OR (closure_id IS NOT NULL) OR (location_id IS NOT NULL))),
    CONSTRAINT splice_no_self CHECK ((fiber_a_id <> fiber_b_id)),
    CONSTRAINT splices_splice_type_check CHECK (((splice_type)::text = ANY ((ARRAY['fusion'::character varying, 'mechanical'::character varying])::text[])))
);

--
-- Name: staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: time_clock_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_clock_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    staff_id uuid,
    project_id uuid NOT NULL,
    job_id uuid,
    job_title text,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    notes text,
    created_time_entry_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: time_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    staff_id uuid,
    entry_date date NOT NULL,
    hours numeric(8,4) NOT NULL,
    job_title character varying(100),
    notes text,
    import_batch character varying(200),
    is_billable boolean DEFAULT true NOT NULL,
    unbilled_category text,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    pending_project_request_id uuid
);

--
-- Name: csv_review_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.csv_review_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    imported_at timestamp with time zone DEFAULT now() NOT NULL,
    imported_by_user_id uuid,
    csv_filename text,
    raw_row jsonb NOT NULL,
    match_attempts jsonb NOT NULL,
    suggested_project_id uuid,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    matched_project_id uuid,
    resolved_at timestamp with time zone,
    resolved_by_user_id uuid,
    notes text,
    CONSTRAINT csv_review_queue_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('matched'::character varying)::text, ('discarded'::character varying)::text])))
);

--
-- Name: time_entry_audit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_entry_audit (
    id bigint NOT NULL,
    time_entry_id uuid,
    actor_user_id uuid,
    actor_username text,
    action character varying(20) NOT NULL,
    change_summary text,
    before_data jsonb,
    after_data jsonb,
    meaningful boolean DEFAULT false,
    source character varying(20),
    at timestamp with time zone DEFAULT now() NOT NULL,
    user_agent text,
    ip text
);

--
-- Name: time_entry_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.time_entry_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: time_entry_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.time_entry_audit_id_seq OWNED BY public.time_entry_audit.id;

--
-- Name: training_cert_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_cert_attempts (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    cert_track text NOT NULL,
    attempt_date timestamp with time zone DEFAULT now() NOT NULL,
    score smallint NOT NULL,
    passed boolean NOT NULL,
    time_taken_seconds integer,
    domain_scores jsonb,
    total_items integer NOT NULL,
    correct_items integer NOT NULL,
    CONSTRAINT training_cert_attempts_cert_track_check CHECK ((cert_track = ANY (ARRAY['OSP-Designer'::text, 'RCDD'::text, 'CFOT'::text, 'CFOS-O'::text]))),
    CONSTRAINT training_cert_attempts_score_check CHECK (((score >= 0) AND (score <= 100)))
);

--
-- Name: training_cert_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_cert_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: training_cert_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_cert_attempts_id_seq OWNED BY public.training_cert_attempts.id;

--
-- Name: training_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_progress (
    user_id uuid NOT NULL,
    course_id text NOT NULL,
    lesson_id text NOT NULL,
    status text DEFAULT 'not_started'::text NOT NULL,
    completion_pct smallint DEFAULT 0 NOT NULL,
    best_score smallint,
    attempts integer DEFAULT 0 NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    last_seen_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT training_progress_best_score_check CHECK (((best_score >= 0) AND (best_score <= 100))),
    CONSTRAINT training_progress_completion_pct_check CHECK (((completion_pct >= 0) AND (completion_pct <= 100))),
    CONSTRAINT training_progress_status_check CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text])))
);

--
-- Name: training_topic_capstone_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_topic_capstone_attempts (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    course_id text NOT NULL,
    attempt_date timestamp with time zone DEFAULT now() NOT NULL,
    score smallint NOT NULL,
    passed boolean NOT NULL,
    total_items integer NOT NULL,
    correct_items integer NOT NULL,
    CONSTRAINT training_topic_capstone_attempts_score_check CHECK (((score >= 0) AND (score <= 100)))
);

--
-- Name: training_topic_capstone_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_topic_capstone_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: training_topic_capstone_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_topic_capstone_attempts_id_seq OWNED BY public.training_topic_capstone_attempts.id;

--
-- Name: undo_buckets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.undo_buckets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    kind character varying(50) NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL
);

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(60) NOT NULL,
    password_hash text NOT NULL,
    role character varying(40) NOT NULL,
    team character varying(20),
    full_name character varying(120),
    email character varying(160),
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now(),
    tokens_invalid_after timestamp with time zone,
    theme character varying(10),
    extra_teams text[] DEFAULT '{}'::text[],
    dashboard_layout jsonb DEFAULT '{}'::jsonb,
    staff_id uuid
);

--
-- Name: time_entry_audit id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entry_audit ALTER COLUMN id SET DEFAULT nextval('public.time_entry_audit_id_seq'::regclass);

--
-- Name: training_cert_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_cert_attempts ALTER COLUMN id SET DEFAULT nextval('public.training_cert_attempts_id_seq'::regclass);

--
-- Name: training_topic_capstone_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_topic_capstone_attempts ALTER COLUMN id SET DEFAULT nextval('public.training_topic_capstone_attempts_id_seq'::regclass);

--
-- Name: ai_messages ai_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT ai_messages_pkey PRIMARY KEY (id);

--
-- Name: billing_batch_items billing_batch_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batch_items
    ADD CONSTRAINT billing_batch_items_pkey PRIMARY KEY (batch_id, project_id);

--
-- Name: billing_batches billing_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batches
    ADD CONSTRAINT billing_batches_pkey PRIMARY KEY (id);

--
-- Name: budget_codes budget_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_codes
    ADD CONSTRAINT budget_codes_pkey PRIMARY KEY (id);

--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);

--
-- Name: clients clients_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_name_key UNIQUE (name);

--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);

--
-- Name: concentrators concentrators_contract_label_area_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concentrators
    ADD CONSTRAINT concentrators_contract_label_area_name_key UNIQUE (contract_label, area_name);

--
-- Name: concentrators concentrators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concentrators
    ADD CONSTRAINT concentrators_pkey PRIMARY KEY (id);

--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);

--
-- Name: customer_clients customer_clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_clients
    ADD CONSTRAINT customer_clients_pkey PRIMARY KEY (user_id, client_id);

--
-- Name: design_stages design_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.design_stages
    ADD CONSTRAINT design_stages_pkey PRIMARY KEY (id);

--
-- Name: design_stages design_stages_project_id_stage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.design_stages
    ADD CONSTRAINT design_stages_project_id_stage_key UNIQUE (project_id, stage);

--
-- Name: ec_job_visibility ec_job_visibility_engineering_contract_id_job_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_job_visibility
    ADD CONSTRAINT ec_job_visibility_engineering_contract_id_job_id_key UNIQUE (engineering_contract_id, job_id);

--
-- Name: ec_job_visibility ec_job_visibility_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_job_visibility
    ADD CONSTRAINT ec_job_visibility_pkey PRIMARY KEY (id);

--
-- Name: ec_service_areas ec_service_areas_engineering_contract_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_service_areas
    ADD CONSTRAINT ec_service_areas_engineering_contract_id_name_key UNIQUE (engineering_contract_id, name);

--
-- Name: ec_service_areas ec_service_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_service_areas
    ADD CONSTRAINT ec_service_areas_pkey PRIMARY KEY (id);

--
-- Name: ec_work_orders ec_work_orders_engineering_contract_id_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_work_orders
    ADD CONSTRAINT ec_work_orders_engineering_contract_id_number_key UNIQUE (engineering_contract_id, number);

--
-- Name: ec_work_orders ec_work_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_work_orders
    ADD CONSTRAINT ec_work_orders_pkey PRIMARY KEY (id);

--
-- Name: engineering_contracts engineering_contracts_client_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.engineering_contracts
    ADD CONSTRAINT engineering_contracts_client_id_name_key UNIQUE (client_id, name);

--
-- Name: engineering_contracts engineering_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.engineering_contracts
    ADD CONSTRAINT engineering_contracts_pkey PRIMARY KEY (id);

--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);

--
-- Name: invoice_templates invoice_templates_job_id_client_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_templates
    ADD CONSTRAINT invoice_templates_job_id_client_id_key UNIQUE (job_id, client_id);

--
-- Name: invoice_templates invoice_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_templates
    ADD CONSTRAINT invoice_templates_pkey PRIMARY KEY (id);

--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);

--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);

--
-- Name: job_assignments job_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_assignments
    ADD CONSTRAINT job_assignments_pkey PRIMARY KEY (id);

--
-- Name: jobs jobs_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_name_key UNIQUE (name);

--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);

--
-- Name: permit_documents permit_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permit_documents
    ADD CONSTRAINT permit_documents_pkey PRIMARY KEY (id);

--
-- Name: permit_stages permit_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permit_stages
    ADD CONSTRAINT permit_stages_pkey PRIMARY KEY (id);

--
-- Name: permit_stages permit_stages_project_id_stage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permit_stages
    ADD CONSTRAINT permit_stages_project_id_stage_key UNIQUE (project_id, stage);

--
-- Name: potential_permits potential_permits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.potential_permits
    ADD CONSTRAINT potential_permits_pkey PRIMARY KEY (id);

--
-- Name: pricing_entries pricing_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_entries
    ADD CONSTRAINT pricing_entries_pkey PRIMARY KEY (id);

--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);

--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (filename);

--
-- Name: setting_change_requests setting_change_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_change_requests
    ADD CONSTRAINT setting_change_requests_pkey PRIMARY KEY (id);

--
-- Name: splice_buffer_tubes splice_buffer_tubes_cable_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_buffer_tubes
    ADD CONSTRAINT splice_buffer_tubes_cable_id_position_key UNIQUE (cable_id, "position");

--
-- Name: splice_buffer_tubes splice_buffer_tubes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_buffer_tubes
    ADD CONSTRAINT splice_buffer_tubes_pkey PRIMARY KEY (id);

--
-- Name: splice_cable_states splice_cable_states_cable_id_location_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cable_states
    ADD CONSTRAINT splice_cable_states_cable_id_location_id_key UNIQUE (cable_id, location_id);

--
-- Name: splice_cable_states splice_cable_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cable_states
    ADD CONSTRAINT splice_cable_states_pkey PRIMARY KEY (id);

--
-- Name: splice_cables splice_cables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cables
    ADD CONSTRAINT splice_cables_pkey PRIMARY KEY (id);

--
-- Name: splice_closure_models splice_closure_models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_models
    ADD CONSTRAINT splice_closure_models_pkey PRIMARY KEY (model);

--
-- Name: splice_closure_public_tokens splice_closure_public_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_public_tokens
    ADD CONSTRAINT splice_closure_public_tokens_pkey PRIMARY KEY (token);

--
-- Name: splice_closure_templates splice_closure_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_templates
    ADD CONSTRAINT splice_closure_templates_pkey PRIMARY KEY (id);

--
-- Name: splice_closures splice_closures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closures
    ADD CONSTRAINT splice_closures_pkey PRIMARY KEY (id);

--
-- Name: splice_comments splice_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_comments
    ADD CONSTRAINT splice_comments_pkey PRIMARY KEY (id);

--
-- Name: splice_custom_features splice_custom_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_custom_features
    ADD CONSTRAINT splice_custom_features_pkey PRIMARY KEY (id);

--
-- Name: splice_custom_layers splice_custom_layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_custom_layers
    ADD CONSTRAINT splice_custom_layers_pkey PRIMARY KEY (id);

--
-- Name: splice_custom_layers splice_custom_layers_project_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_custom_layers
    ADD CONSTRAINT splice_custom_layers_project_id_name_key UNIQUE (project_id, name);

--
-- Name: splice_design_import_changes splice_design_import_changes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_import_changes
    ADD CONSTRAINT splice_design_import_changes_pkey PRIMARY KEY (id);

--
-- Name: splice_design_imports splice_design_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_imports
    ADD CONSTRAINT splice_design_imports_pkey PRIMARY KEY (id);

--
-- Name: splice_fibers splice_fibers_buffer_tube_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_fibers
    ADD CONSTRAINT splice_fibers_buffer_tube_id_position_key UNIQUE (buffer_tube_id, "position");

--
-- Name: splice_fibers splice_fibers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_fibers
    ADD CONSTRAINT splice_fibers_pkey PRIMARY KEY (id);

--
-- Name: splice_field_markups splice_field_markups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_field_markups
    ADD CONSTRAINT splice_field_markups_pkey PRIMARY KEY (id);

--
-- Name: splice_layer_styles splice_layer_styles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_layer_styles
    ADD CONSTRAINT splice_layer_styles_pkey PRIMARY KEY (id);

--
-- Name: splice_layer_styles splice_layer_styles_project_id_layer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_layer_styles
    ADD CONSTRAINT splice_layer_styles_project_id_layer_id_key UNIQUE (project_id, layer_id);

--
-- Name: splice_locations splice_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_locations
    ADD CONSTRAINT splice_locations_pkey PRIMARY KEY (id);

--
-- Name: splice_loss_records splice_loss_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_pkey PRIMARY KEY (id);

--
-- Name: splice_project_public_tokens splice_project_public_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_public_tokens
    ADD CONSTRAINT splice_project_public_tokens_pkey PRIMARY KEY (token);

--
-- Name: splice_project_versions splice_project_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_versions
    ADD CONSTRAINT splice_project_versions_pkey PRIMARY KEY (id);

--
-- Name: splice_project_versions splice_project_versions_project_id_version_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_versions
    ADD CONSTRAINT splice_project_versions_project_id_version_number_key UNIQUE (project_id, version_number);

--
-- Name: splice_projects splice_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_projects
    ADD CONSTRAINT splice_projects_pkey PRIMARY KEY (id);

--
-- Name: splice_ribbon_groups splice_ribbon_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_ribbon_groups
    ADD CONSTRAINT splice_ribbon_groups_pkey PRIMARY KEY (id);

--
-- Name: splice_splitter_outputs splice_splitter_outputs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitter_outputs
    ADD CONSTRAINT splice_splitter_outputs_pkey PRIMARY KEY (id);

--
-- Name: splice_splitter_outputs splice_splitter_outputs_splitter_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitter_outputs
    ADD CONSTRAINT splice_splitter_outputs_splitter_id_position_key UNIQUE (splitter_id, "position");

--
-- Name: splice_splitters splice_splitters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitters
    ADD CONSTRAINT splice_splitters_pkey PRIMARY KEY (id);

--
-- Name: splice_strand_states splice_strand_states_cable_id_location_id_strand_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_strand_states
    ADD CONSTRAINT splice_strand_states_cable_id_location_id_strand_position_key UNIQUE (cable_id, location_id, strand_position);

--
-- Name: splice_strand_states splice_strand_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_strand_states
    ADD CONSTRAINT splice_strand_states_pkey PRIMARY KEY (id);

--
-- Name: splice_trays splice_trays_closure_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_trays
    ADD CONSTRAINT splice_trays_closure_id_position_key UNIQUE (closure_id, "position");

--
-- Name: splice_trays splice_trays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_trays
    ADD CONSTRAINT splice_trays_pkey PRIMARY KEY (id);

--
-- Name: splices splices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_pkey PRIMARY KEY (id);

--
-- Name: staff staff_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_name_key UNIQUE (name);

--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);

--
-- Name: time_clock_sessions time_clock_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_clock_sessions
    ADD CONSTRAINT time_clock_sessions_pkey PRIMARY KEY (id);

--
-- Name: time_entries time_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_pkey PRIMARY KEY (id);

--
-- Name: csv_review_queue csv_review_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_review_queue
    ADD CONSTRAINT csv_review_queue_pkey PRIMARY KEY (id);

--
-- Name: time_entry_audit time_entry_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entry_audit
    ADD CONSTRAINT time_entry_audit_pkey PRIMARY KEY (id);

--
-- Name: training_cert_attempts training_cert_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_cert_attempts
    ADD CONSTRAINT training_cert_attempts_pkey PRIMARY KEY (id);

--
-- Name: training_progress training_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT training_progress_pkey PRIMARY KEY (user_id, lesson_id);

--
-- Name: training_topic_capstone_attempts training_topic_capstone_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_topic_capstone_attempts
    ADD CONSTRAINT training_topic_capstone_attempts_pkey PRIMARY KEY (id);

--
-- Name: undo_buckets undo_buckets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.undo_buckets
    ADD CONSTRAINT undo_buckets_pkey PRIMARY KEY (id);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);

--
-- Name: idx_audit_actor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_actor ON public.time_entry_audit USING btree (actor_user_id, at DESC);

--
-- Name: idx_audit_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_at ON public.time_entry_audit USING btree (at DESC);

--
-- Name: idx_audit_entry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_entry ON public.time_entry_audit USING btree (time_entry_id, at DESC);

--
-- Name: idx_audit_meaningful; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_meaningful ON public.time_entry_audit USING btree (meaningful, at DESC) WHERE (meaningful = true);

--
-- Name: idx_billing_batch_items_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_batch_items_project_id ON public.billing_batch_items USING btree (project_id);

--
-- Name: idx_billing_batches_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_batches_client_id ON public.billing_batches USING btree (client_id);

--
-- Name: idx_budgets_engineering_contract_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_budgets_engineering_contract_id ON public.budgets USING btree (engineering_contract_id);

--
-- Name: idx_contracts_ec_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contracts_ec_id ON public.contracts USING btree (engineering_contract_id);

--
-- Name: idx_contracts_engineering_contract_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contracts_engineering_contract_id ON public.contracts USING btree (engineering_contract_id);

--
-- Name: idx_customer_clients_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_clients_client ON public.customer_clients USING btree (client_id);

--
-- Name: idx_ec_job_visibility_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ec_job_visibility_created_by ON public.ec_job_visibility USING btree (created_by_user_id) WHERE (created_by_user_id IS NOT NULL);

--
-- Name: idx_ec_job_visibility_ec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ec_job_visibility_ec ON public.ec_job_visibility USING btree (engineering_contract_id);

--
-- Name: idx_ec_job_visibility_job; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ec_job_visibility_job ON public.ec_job_visibility USING btree (job_id);

--
-- Name: idx_ec_service_areas_ec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ec_service_areas_ec ON public.ec_service_areas USING btree (engineering_contract_id);

--
-- Name: idx_ec_work_orders_ec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ec_work_orders_ec ON public.ec_work_orders USING btree (engineering_contract_id);

--
-- Name: idx_ec_work_orders_sa; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ec_work_orders_sa ON public.ec_work_orders USING btree (service_area_id);

--
-- Name: idx_engineering_contracts_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_engineering_contracts_client_id ON public.engineering_contracts USING btree (client_id);

--
-- Name: idx_engineering_contracts_program; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_engineering_contracts_program ON public.engineering_contracts USING btree (program) WHERE (program IS NOT NULL);

--
-- Name: idx_invoice_items_invoice_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items USING btree (invoice_id);

--
-- Name: idx_invoice_items_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoice_items_project_id ON public.invoice_items USING btree (project_id);

--
-- Name: idx_invoice_templates_job_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoice_templates_job_client ON public.invoice_templates USING btree (job_id, client_id);

--
-- Name: idx_job_assignments_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_assignments_client ON public.job_assignments USING btree (client_id) WHERE (client_id IS NOT NULL);

--
-- Name: idx_job_assignments_ec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_assignments_ec ON public.job_assignments USING btree (engineering_contract_id) WHERE (engineering_contract_id IS NOT NULL);

--
-- Name: idx_job_assignments_job; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_assignments_job ON public.job_assignments USING btree (job_id);

--
-- Name: idx_job_assignments_team; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_assignments_team ON public.job_assignments USING btree (team) WHERE (team IS NOT NULL);

--
-- Name: idx_jobs_program_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jobs_program_scope ON public.jobs USING btree (program_scope) WHERE (active = true);

--
-- Name: idx_permit_documents_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permit_documents_project_id ON public.permit_documents USING btree (project_id);

--
-- Name: idx_permit_stages_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permit_stages_active ON public.permit_stages USING btree (project_id) WHERE (completed_at IS NULL);

--
-- Name: idx_permit_stages_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permit_stages_project_id ON public.permit_stages USING btree (project_id);

--
-- Name: idx_pricing_entries_program; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pricing_entries_program ON public.pricing_entries USING btree (program);

--
-- Name: idx_projects_billed_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_billed_date ON public.projects USING btree (billed_date);

--
-- Name: idx_projects_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_client_id ON public.projects USING btree (client_id);

--
-- Name: idx_projects_contract_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_contract_id ON public.projects USING btree (contract_id);

--
-- Name: idx_projects_engineering_contract_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_engineering_contract_id ON public.projects USING btree (engineering_contract_id) WHERE (engineering_contract_id IS NOT NULL);

--
-- Name: idx_projects_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_parent_id ON public.projects USING btree (parent_id);

--
-- Name: idx_projects_program; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_program ON public.projects USING btree (program) WHERE (program IS NOT NULL);

--
-- Name: idx_projects_rollup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_rollup ON public.projects USING btree (rollup_level, parent_id, rollup_key) WHERE (is_rollup = true);

--
-- Name: idx_projects_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_status ON public.projects USING btree (status);

--
-- Name: idx_scr_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scr_pending ON public.setting_change_requests USING btree (created_at DESC) WHERE ((status)::text = 'pending'::text);

--
-- Name: idx_sessions_user_started; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_started ON public.time_clock_sessions USING btree (user_id, started_at DESC);

--
-- Name: idx_splice_buffer_tubes_cable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_buffer_tubes_cable ON public.splice_buffer_tubes USING btree (cable_id);

--
-- Name: idx_splice_cable_states_cable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_cable_states_cable ON public.splice_cable_states USING btree (cable_id);

--
-- Name: idx_splice_cable_states_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_cable_states_location ON public.splice_cable_states USING btree (location_id);

--
-- Name: idx_splice_cables_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_cables_category ON public.splice_cables USING btree (category);

--
-- Name: idx_splice_cables_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_cables_project ON public.splice_cables USING btree (project_id);

--
-- Name: idx_splice_closure_templates_model; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_closure_templates_model ON public.splice_closure_templates USING btree (model);

--
-- Name: idx_splice_closure_templates_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_closure_templates_published ON public.splice_closure_templates USING btree (published_at DESC NULLS LAST);

--
-- Name: idx_splice_closure_templates_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_closure_templates_scope ON public.splice_closure_templates USING btree (scope_client_id);

--
-- Name: idx_splice_closures_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_closures_location ON public.splice_closures USING btree (location_id);

--
-- Name: idx_splice_comments_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_comments_project ON public.splice_comments USING btree (project_id, created_at DESC);

--
-- Name: idx_splice_comments_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_comments_target ON public.splice_comments USING btree (target_table, target_id);

--
-- Name: idx_splice_custom_features_layer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_custom_features_layer ON public.splice_custom_features USING btree (layer_id);

--
-- Name: idx_splice_custom_features_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_custom_features_project ON public.splice_custom_features USING btree (project_id);

--
-- Name: idx_splice_custom_layers_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_custom_layers_project ON public.splice_custom_layers USING btree (project_id);

--
-- Name: idx_splice_design_import_changes_decision; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_design_import_changes_decision ON public.splice_design_import_changes USING btree (import_id, decision);

--
-- Name: idx_splice_design_import_changes_import; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_design_import_changes_import ON public.splice_design_import_changes USING btree (import_id);

--
-- Name: idx_splice_design_imports_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_design_imports_project ON public.splice_design_imports USING btree (project_id, uploaded_at DESC);

--
-- Name: idx_splice_design_imports_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_design_imports_status ON public.splice_design_imports USING btree (project_id, status);

--
-- Name: idx_splice_fibers_circuit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_fibers_circuit ON public.splice_fibers USING btree (circuit_name) WHERE (circuit_name IS NOT NULL);

--
-- Name: idx_splice_fibers_tube; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_fibers_tube ON public.splice_fibers USING btree (buffer_tube_id);

--
-- Name: idx_splice_field_markups_closure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_field_markups_closure ON public.splice_field_markups USING btree (closure_id);

--
-- Name: idx_splice_field_markups_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_field_markups_project ON public.splice_field_markups USING btree (project_id);

--
-- Name: idx_splice_field_markups_uploaded_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_field_markups_uploaded_at ON public.splice_field_markups USING btree (uploaded_at DESC);

--
-- Name: idx_splice_layer_styles_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_layer_styles_project ON public.splice_layer_styles USING btree (project_id);

--
-- Name: idx_splice_locations_geo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_locations_geo ON public.splice_locations USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));

--
-- Name: idx_splice_locations_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_locations_project ON public.splice_locations USING btree (project_id);

--
-- Name: idx_splice_loss_records_closure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_loss_records_closure ON public.splice_loss_records USING btree (closure_id) WHERE (closure_id IS NOT NULL);

--
-- Name: idx_splice_loss_records_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_loss_records_location ON public.splice_loss_records USING btree (location_id) WHERE (location_id IS NOT NULL);

--
-- Name: idx_splice_loss_records_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_loss_records_project ON public.splice_loss_records USING btree (project_id, measured_at DESC);

--
-- Name: idx_splice_loss_records_splice; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_loss_records_splice ON public.splice_loss_records USING btree (splice_id) WHERE (splice_id IS NOT NULL);

--
-- Name: idx_splice_project_public_tokens_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_project_public_tokens_project ON public.splice_project_public_tokens USING btree (project_id);

--
-- Name: idx_splice_projects_designer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_projects_designer ON public.splice_projects USING btree (designer_id);

--
-- Name: idx_splice_projects_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_projects_status ON public.splice_projects USING btree (status);

--
-- Name: idx_splice_public_tokens_closure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_public_tokens_closure ON public.splice_closure_public_tokens USING btree (closure_id);

--
-- Name: idx_splice_public_tokens_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_public_tokens_project ON public.splice_closure_public_tokens USING btree (project_id);

--
-- Name: idx_splice_splitter_outputs_splitter; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_splitter_outputs_splitter ON public.splice_splitter_outputs USING btree (splitter_id);

--
-- Name: idx_splice_splitters_closure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_splitters_closure ON public.splice_splitters USING btree (closure_id);

--
-- Name: idx_splice_strand_states_cable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_strand_states_cable ON public.splice_strand_states USING btree (cable_id);

--
-- Name: idx_splice_strand_states_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_strand_states_location ON public.splice_strand_states USING btree (location_id);

--
-- Name: idx_splice_strand_states_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_strand_states_state ON public.splice_strand_states USING btree (state);

--
-- Name: idx_splice_trays_closure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_trays_closure ON public.splice_trays USING btree (closure_id);

--
-- Name: idx_splice_versions_project_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splice_versions_project_created ON public.splice_project_versions USING btree (project_id, created_at DESC);

--
-- Name: idx_splices_closure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splices_closure ON public.splices USING btree (closure_id);

--
-- Name: idx_splices_fiber_a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splices_fiber_a ON public.splices USING btree (fiber_a_id);

--
-- Name: idx_splices_fiber_b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splices_fiber_b ON public.splices USING btree (fiber_b_id);

--
-- Name: idx_splices_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splices_location ON public.splices USING btree (location_id);

--
-- Name: idx_splices_ribbon_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splices_ribbon_group ON public.splices USING btree (ribbon_group_id);

--
-- Name: idx_splices_tray; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_splices_tray ON public.splices USING btree (tray_id);

--
-- Name: csv_review_queue_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX csv_review_queue_status_idx ON public.csv_review_queue USING btree (status, imported_at DESC);

--
-- Name: idx_time_entries_entry_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_entry_date ON public.time_entries USING btree (entry_date);

--
-- Name: idx_time_entries_pending_request; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_pending_request ON public.time_entries USING btree (pending_project_request_id) WHERE (pending_project_request_id IS NOT NULL);

--
-- Name: idx_time_entries_project_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_project_date ON public.time_entries USING btree (project_id, entry_date);

--
-- Name: idx_time_entries_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_project_id ON public.time_entries USING btree (project_id);

--
-- Name: idx_time_entries_staff_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_staff_date ON public.time_entries USING btree (staff_id, entry_date);

--
-- Name: idx_time_entries_staff_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_staff_id ON public.time_entries USING btree (staff_id);

--
-- Name: idx_time_entries_unbilled; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_unbilled ON public.time_entries USING btree (entry_date) WHERE (is_billable = false);

--
-- Name: idx_training_capstone_user_course_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_capstone_user_course_date ON public.training_topic_capstone_attempts USING btree (user_id, course_id, attempt_date DESC);

--
-- Name: idx_training_cert_attempts_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_cert_attempts_user_date ON public.training_cert_attempts USING btree (user_id, attempt_date DESC);

--
-- Name: idx_training_progress_user_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_progress_user_course ON public.training_progress USING btree (user_id, course_id);

--
-- Name: idx_undo_buckets_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_undo_buckets_expires_at ON public.undo_buckets USING btree (expires_at);

--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (lower((username)::text));

--
-- Name: job_assignments_unique_pin; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX job_assignments_unique_pin ON public.job_assignments USING btree (job_id, COALESCE(client_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(engineering_contract_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(team, ''::text));

--
-- Name: uniq_active_session_per_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_active_session_per_user ON public.time_clock_sessions USING btree (user_id) WHERE (ended_at IS NULL);

--
-- Name: uniq_pricing_entries_job_program_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_pricing_entries_job_program_code ON public.pricing_entries USING btree (job_id, program, COALESCE(billing_code, '__no_code__'::character varying));

--
-- Name: uniq_project_name_per_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_project_name_per_parent ON public.projects USING btree (COALESCE((parent_id)::text, 'ROOT'::text), lower((name)::text)) WHERE (COALESCE(is_rollup, false) = false);

--
-- Name: budgets budgets_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--
-- Name: engineering_contracts engineering_contracts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER engineering_contracts_updated_at BEFORE UPDATE ON public.engineering_contracts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--
-- Name: invoice_templates invoice_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER invoice_templates_updated_at BEFORE UPDATE ON public.invoice_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--
-- Name: pricing_entries pricing_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER pricing_entries_updated_at BEFORE UPDATE ON public.pricing_entries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--
-- Name: projects projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--
-- Name: projects trg_sync_projected_revenue_footage; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_sync_projected_revenue_footage BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.sync_projected_revenue_footage();

--
-- Name: billing_batch_items billing_batch_items_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batch_items
    ADD CONSTRAINT billing_batch_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.billing_batches(id) ON DELETE CASCADE;

--
-- Name: billing_batch_items billing_batch_items_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batch_items
    ADD CONSTRAINT billing_batch_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE RESTRICT;

--
-- Name: billing_batches billing_batches_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batches
    ADD CONSTRAINT billing_batches_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

--
-- Name: billing_batches billing_batches_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batches
    ADD CONSTRAINT billing_batches_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: billing_batches billing_batches_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batches
    ADD CONSTRAINT billing_batches_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE SET NULL;

--
-- Name: billing_batches billing_batches_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_batches
    ADD CONSTRAINT billing_batches_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE SET NULL;

--
-- Name: budget_codes budget_codes_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_codes
    ADD CONSTRAINT budget_codes_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;

--
-- Name: budget_codes budget_codes_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_codes
    ADD CONSTRAINT budget_codes_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE SET NULL;

--
-- Name: budgets budgets_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE CASCADE;

--
-- Name: budgets budgets_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

--
-- Name: contracts contracts_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

--
-- Name: contracts contracts_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE SET NULL;

--
-- Name: customer_clients customer_clients_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_clients
    ADD CONSTRAINT customer_clients_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

--
-- Name: customer_clients customer_clients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_clients
    ADD CONSTRAINT customer_clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: design_stages design_stages_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.design_stages
    ADD CONSTRAINT design_stages_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

--
-- Name: ec_job_visibility ec_job_visibility_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_job_visibility
    ADD CONSTRAINT ec_job_visibility_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE CASCADE;

--
-- Name: ec_job_visibility ec_job_visibility_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_job_visibility
    ADD CONSTRAINT ec_job_visibility_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

--
-- Name: ec_job_visibility ec_job_visibility_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_job_visibility
    ADD CONSTRAINT ec_job_visibility_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: ec_service_areas ec_service_areas_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_service_areas
    ADD CONSTRAINT ec_service_areas_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE CASCADE;

--
-- Name: ec_work_orders ec_work_orders_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_work_orders
    ADD CONSTRAINT ec_work_orders_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE CASCADE;

--
-- Name: ec_work_orders ec_work_orders_service_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ec_work_orders
    ADD CONSTRAINT ec_work_orders_service_area_id_fkey FOREIGN KEY (service_area_id) REFERENCES public.ec_service_areas(id) ON DELETE SET NULL;

--
-- Name: engineering_contracts engineering_contracts_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.engineering_contracts
    ADD CONSTRAINT engineering_contracts_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

--
-- Name: invoice_items invoice_items_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);

--
-- Name: invoice_templates invoice_templates_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_templates
    ADD CONSTRAINT invoice_templates_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

--
-- Name: invoice_templates invoice_templates_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_templates
    ADD CONSTRAINT invoice_templates_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: invoice_templates invoice_templates_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_templates
    ADD CONSTRAINT invoice_templates_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

--
-- Name: invoices invoices_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);

--
-- Name: job_assignments job_assignments_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_assignments
    ADD CONSTRAINT job_assignments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

--
-- Name: job_assignments job_assignments_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_assignments
    ADD CONSTRAINT job_assignments_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE CASCADE;

--
-- Name: job_assignments job_assignments_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_assignments
    ADD CONSTRAINT job_assignments_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

--
-- Name: permit_documents permit_documents_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permit_documents
    ADD CONSTRAINT permit_documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

--
-- Name: permit_documents permit_documents_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permit_documents
    ADD CONSTRAINT permit_documents_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: permit_stages permit_stages_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permit_stages
    ADD CONSTRAINT permit_stages_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

--
-- Name: potential_permits potential_permits_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.potential_permits
    ADD CONSTRAINT potential_permits_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

--
-- Name: pricing_entries pricing_entries_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_entries
    ADD CONSTRAINT pricing_entries_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

--
-- Name: projects projects_budget_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_budget_code_id_fkey FOREIGN KEY (budget_code_id) REFERENCES public.budget_codes(id) ON DELETE SET NULL;

--
-- Name: projects projects_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);

--
-- Name: projects projects_concentrator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_concentrator_id_fkey FOREIGN KEY (concentrator_id) REFERENCES public.concentrators(id) ON DELETE SET NULL;

--
-- Name: projects projects_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id);

--
-- Name: projects projects_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: projects projects_engineering_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_engineering_contract_id_fkey FOREIGN KEY (engineering_contract_id) REFERENCES public.engineering_contracts(id) ON DELETE SET NULL;

--
-- Name: projects projects_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE SET NULL;

--
-- Name: projects projects_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.projects(id) ON DELETE RESTRICT;

--
-- Name: projects projects_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: splice_buffer_tubes splice_buffer_tubes_cable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_buffer_tubes
    ADD CONSTRAINT splice_buffer_tubes_cable_id_fkey FOREIGN KEY (cable_id) REFERENCES public.splice_cables(id) ON DELETE CASCADE;

--
-- Name: splice_cable_states splice_cable_states_cable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cable_states
    ADD CONSTRAINT splice_cable_states_cable_id_fkey FOREIGN KEY (cable_id) REFERENCES public.splice_cables(id) ON DELETE CASCADE;

--
-- Name: splice_cable_states splice_cable_states_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cable_states
    ADD CONSTRAINT splice_cable_states_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.splice_locations(id) ON DELETE CASCADE;

--
-- Name: splice_cables splice_cables_from_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cables
    ADD CONSTRAINT splice_cables_from_location_id_fkey FOREIGN KEY (from_location_id) REFERENCES public.splice_locations(id) ON DELETE SET NULL;

--
-- Name: splice_cables splice_cables_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cables
    ADD CONSTRAINT splice_cables_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_cables splice_cables_to_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_cables
    ADD CONSTRAINT splice_cables_to_location_id_fkey FOREIGN KEY (to_location_id) REFERENCES public.splice_locations(id) ON DELETE SET NULL;

--
-- Name: splice_closure_public_tokens splice_closure_public_tokens_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_public_tokens
    ADD CONSTRAINT splice_closure_public_tokens_closure_id_fkey FOREIGN KEY (closure_id) REFERENCES public.splice_closures(id) ON DELETE CASCADE;

--
-- Name: splice_closure_public_tokens splice_closure_public_tokens_created_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_public_tokens
    ADD CONSTRAINT splice_closure_public_tokens_created_by_staff_id_fkey FOREIGN KEY (created_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_closure_public_tokens splice_closure_public_tokens_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_public_tokens
    ADD CONSTRAINT splice_closure_public_tokens_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_closure_templates splice_closure_templates_created_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_templates
    ADD CONSTRAINT splice_closure_templates_created_by_staff_id_fkey FOREIGN KEY (created_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_closure_templates splice_closure_templates_published_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_templates
    ADD CONSTRAINT splice_closure_templates_published_by_staff_id_fkey FOREIGN KEY (published_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_closure_templates splice_closure_templates_scope_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closure_templates
    ADD CONSTRAINT splice_closure_templates_scope_client_id_fkey FOREIGN KEY (scope_client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

--
-- Name: splice_closures splice_closures_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_closures
    ADD CONSTRAINT splice_closures_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.splice_locations(id) ON DELETE CASCADE;

--
-- Name: splice_comments splice_comments_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_comments
    ADD CONSTRAINT splice_comments_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: splice_comments splice_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_comments
    ADD CONSTRAINT splice_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.splice_comments(id) ON DELETE CASCADE;

--
-- Name: splice_comments splice_comments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_comments
    ADD CONSTRAINT splice_comments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_comments splice_comments_resolved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_comments
    ADD CONSTRAINT splice_comments_resolved_by_user_id_fkey FOREIGN KEY (resolved_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: splice_custom_features splice_custom_features_layer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_custom_features
    ADD CONSTRAINT splice_custom_features_layer_id_fkey FOREIGN KEY (layer_id) REFERENCES public.splice_custom_layers(id) ON DELETE CASCADE;

--
-- Name: splice_custom_features splice_custom_features_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_custom_features
    ADD CONSTRAINT splice_custom_features_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_custom_layers splice_custom_layers_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_custom_layers
    ADD CONSTRAINT splice_custom_layers_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_design_import_changes splice_design_import_changes_decision_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_import_changes
    ADD CONSTRAINT splice_design_import_changes_decision_by_staff_id_fkey FOREIGN KEY (decision_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_design_import_changes splice_design_import_changes_import_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_import_changes
    ADD CONSTRAINT splice_design_import_changes_import_id_fkey FOREIGN KEY (import_id) REFERENCES public.splice_design_imports(id) ON DELETE CASCADE;

--
-- Name: splice_design_imports splice_design_imports_decision_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_imports
    ADD CONSTRAINT splice_design_imports_decision_by_staff_id_fkey FOREIGN KEY (decision_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_design_imports splice_design_imports_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_imports
    ADD CONSTRAINT splice_design_imports_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_design_imports splice_design_imports_uploaded_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_design_imports
    ADD CONSTRAINT splice_design_imports_uploaded_by_staff_id_fkey FOREIGN KEY (uploaded_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_fibers splice_fibers_buffer_tube_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_fibers
    ADD CONSTRAINT splice_fibers_buffer_tube_id_fkey FOREIGN KEY (buffer_tube_id) REFERENCES public.splice_buffer_tubes(id) ON DELETE CASCADE;

--
-- Name: splice_field_markups splice_field_markups_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_field_markups
    ADD CONSTRAINT splice_field_markups_closure_id_fkey FOREIGN KEY (closure_id) REFERENCES public.splice_closures(id) ON DELETE CASCADE;

--
-- Name: splice_field_markups splice_field_markups_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_field_markups
    ADD CONSTRAINT splice_field_markups_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_field_markups splice_field_markups_token_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_field_markups
    ADD CONSTRAINT splice_field_markups_token_fkey FOREIGN KEY (token) REFERENCES public.splice_closure_public_tokens(token) ON DELETE SET NULL;

--
-- Name: splice_layer_styles splice_layer_styles_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_layer_styles
    ADD CONSTRAINT splice_layer_styles_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_locations splice_locations_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_locations
    ADD CONSTRAINT splice_locations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_loss_records splice_loss_records_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_closure_id_fkey FOREIGN KEY (closure_id) REFERENCES public.splice_closures(id) ON DELETE SET NULL;

--
-- Name: splice_loss_records splice_loss_records_field_token_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_field_token_fkey FOREIGN KEY (field_token) REFERENCES public.splice_closure_public_tokens(token) ON DELETE SET NULL;

--
-- Name: splice_loss_records splice_loss_records_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.splice_locations(id) ON DELETE SET NULL;

--
-- Name: splice_loss_records splice_loss_records_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_loss_records splice_loss_records_splice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_splice_id_fkey FOREIGN KEY (splice_id) REFERENCES public.splices(id) ON DELETE SET NULL;

--
-- Name: splice_loss_records splice_loss_records_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_loss_records
    ADD CONSTRAINT splice_loss_records_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: splice_project_public_tokens splice_project_public_tokens_created_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_public_tokens
    ADD CONSTRAINT splice_project_public_tokens_created_by_staff_id_fkey FOREIGN KEY (created_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_project_public_tokens splice_project_public_tokens_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_public_tokens
    ADD CONSTRAINT splice_project_public_tokens_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_project_versions splice_project_versions_created_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_versions
    ADD CONSTRAINT splice_project_versions_created_by_staff_id_fkey FOREIGN KEY (created_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_project_versions splice_project_versions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_project_versions
    ADD CONSTRAINT splice_project_versions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.splice_projects(id) ON DELETE CASCADE;

--
-- Name: splice_projects splice_projects_designer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_projects
    ADD CONSTRAINT splice_projects_designer_id_fkey FOREIGN KEY (designer_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_projects splice_projects_locked_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_projects
    ADD CONSTRAINT splice_projects_locked_by_staff_id_fkey FOREIGN KEY (locked_by_staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: splice_ribbon_groups splice_ribbon_groups_tray_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_ribbon_groups
    ADD CONSTRAINT splice_ribbon_groups_tray_id_fkey FOREIGN KEY (tray_id) REFERENCES public.splice_trays(id) ON DELETE CASCADE;

--
-- Name: splice_splitter_outputs splice_splitter_outputs_output_fiber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitter_outputs
    ADD CONSTRAINT splice_splitter_outputs_output_fiber_id_fkey FOREIGN KEY (output_fiber_id) REFERENCES public.splice_fibers(id) ON DELETE SET NULL;

--
-- Name: splice_splitter_outputs splice_splitter_outputs_splitter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitter_outputs
    ADD CONSTRAINT splice_splitter_outputs_splitter_id_fkey FOREIGN KEY (splitter_id) REFERENCES public.splice_splitters(id) ON DELETE CASCADE;

--
-- Name: splice_splitters splice_splitters_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitters
    ADD CONSTRAINT splice_splitters_closure_id_fkey FOREIGN KEY (closure_id) REFERENCES public.splice_closures(id) ON DELETE CASCADE;

--
-- Name: splice_splitters splice_splitters_input_fiber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_splitters
    ADD CONSTRAINT splice_splitters_input_fiber_id_fkey FOREIGN KEY (input_fiber_id) REFERENCES public.splice_fibers(id) ON DELETE SET NULL;

--
-- Name: splice_strand_states splice_strand_states_cable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_strand_states
    ADD CONSTRAINT splice_strand_states_cable_id_fkey FOREIGN KEY (cable_id) REFERENCES public.splice_cables(id) ON DELETE CASCADE;

--
-- Name: splice_strand_states splice_strand_states_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_strand_states
    ADD CONSTRAINT splice_strand_states_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.splice_locations(id) ON DELETE CASCADE;

--
-- Name: splice_trays splice_trays_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splice_trays
    ADD CONSTRAINT splice_trays_closure_id_fkey FOREIGN KEY (closure_id) REFERENCES public.splice_closures(id) ON DELETE CASCADE;

--
-- Name: splices splices_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_closure_id_fkey FOREIGN KEY (closure_id) REFERENCES public.splice_closures(id) ON DELETE CASCADE;

--
-- Name: splices splices_fiber_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_fiber_a_id_fkey FOREIGN KEY (fiber_a_id) REFERENCES public.splice_fibers(id) ON DELETE CASCADE;

--
-- Name: splices splices_fiber_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_fiber_b_id_fkey FOREIGN KEY (fiber_b_id) REFERENCES public.splice_fibers(id) ON DELETE CASCADE;

--
-- Name: splices splices_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.splice_locations(id) ON DELETE CASCADE;

--
-- Name: splices splices_ribbon_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_ribbon_group_id_fkey FOREIGN KEY (ribbon_group_id) REFERENCES public.splice_ribbon_groups(id) ON DELETE SET NULL;

--
-- Name: splices splices_tray_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.splices
    ADD CONSTRAINT splices_tray_id_fkey FOREIGN KEY (tray_id) REFERENCES public.splice_trays(id) ON DELETE CASCADE;

--
-- Name: time_clock_sessions time_clock_sessions_created_time_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_clock_sessions
    ADD CONSTRAINT time_clock_sessions_created_time_entry_id_fkey FOREIGN KEY (created_time_entry_id) REFERENCES public.time_entries(id) ON DELETE SET NULL;

--
-- Name: time_clock_sessions time_clock_sessions_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_clock_sessions
    ADD CONSTRAINT time_clock_sessions_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE SET NULL;

--
-- Name: time_clock_sessions time_clock_sessions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_clock_sessions
    ADD CONSTRAINT time_clock_sessions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

--
-- Name: time_clock_sessions time_clock_sessions_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_clock_sessions
    ADD CONSTRAINT time_clock_sessions_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
-- Name: time_clock_sessions time_clock_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_clock_sessions
    ADD CONSTRAINT time_clock_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: time_entries time_entries_pending_project_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_pending_project_request_id_fkey FOREIGN KEY (pending_project_request_id) REFERENCES public.setting_change_requests(id) ON DELETE SET NULL;

--
-- Name: time_entries time_entries_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE RESTRICT;

--
-- Name: time_entries time_entries_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id);

--
-- Name: time_entries time_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: csv_review_queue csv_review_queue_imported_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_review_queue
    ADD CONSTRAINT csv_review_queue_imported_by_user_id_fkey FOREIGN KEY (imported_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: csv_review_queue csv_review_queue_matched_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_review_queue
    ADD CONSTRAINT csv_review_queue_matched_project_id_fkey FOREIGN KEY (matched_project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

--
-- Name: csv_review_queue csv_review_queue_resolved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_review_queue
    ADD CONSTRAINT csv_review_queue_resolved_by_user_id_fkey FOREIGN KEY (resolved_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: csv_review_queue csv_review_queue_suggested_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_review_queue
    ADD CONSTRAINT csv_review_queue_suggested_project_id_fkey FOREIGN KEY (suggested_project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

--
-- Name: time_entry_audit time_entry_audit_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entry_audit
    ADD CONSTRAINT time_entry_audit_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: training_cert_attempts training_cert_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_cert_attempts
    ADD CONSTRAINT training_cert_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: training_progress training_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT training_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: training_topic_capstone_attempts training_topic_capstone_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_topic_capstone_attempts
    ADD CONSTRAINT training_topic_capstone_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: users users_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE SET NULL;

--
--
