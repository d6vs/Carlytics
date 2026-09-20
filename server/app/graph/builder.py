"""State graph workflow builder for the valuation pipeline.

Constructs and compiles the 3-node valuation workflow:
    predict_price -> inspect_image -> generate_report
"""

from typing import Callable

from app.core.logging import get_logger
from app.graph.nodes import (
    generate_report_node,
    inspect_image_node,
    predict_price_node,
)
from app.graph.state import ValuationState

logger = get_logger(__name__)


class ValuationGraphRunner:
    """Orchestrates the 3-node state graph execution pipeline."""

    def __init__(self) -> None:
        self.nodes: list[tuple[str, Callable[[ValuationState], ValuationState]]] = [
            ("predict_price", predict_price_node),
            ("inspect_image", inspect_image_node),
            ("generate_report", generate_report_node),
        ]

    def invoke(self, state: ValuationState) -> ValuationState:
        """Run the state through the sequential node graph."""
        logger.info("Starting valuation state graph execution...")

        # Node 1: predict_price
        state = predict_price_node(state)

        # Node 2: inspect_image
        state = inspect_image_node(state)

        # Conditional branch: Node 3 generate_report (only if requested)
        if state.generate_report:
            state = generate_report_node(state)
        else:
            logger.info("StateGraph: generate_report=False — skipping LLM node.")

        logger.info("Valuation state graph execution completed successfully.")
        return state


def build_valuation_graph() -> ValuationGraphRunner:
    """Construct and compile the 3-node valuation workflow graph runner."""
    logger.info("Valuation state graph runner compiled.")
    return ValuationGraphRunner()
