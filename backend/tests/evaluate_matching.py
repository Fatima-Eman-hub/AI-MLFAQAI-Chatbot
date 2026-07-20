"""
Evaluation script for the FAQAI TF-IDF + Cosine Similarity matching engine.

Run from the backend/ directory:
    python -m tests.evaluate_matching

Reports:
- Core accuracy: % of paraphrased queries matched to the CORRECT FAQ id
- Out-of-domain precision: % of irrelevant queries correctly rejected (fallback)
- Known-limitation pass rate: informational only, documents acronym/synonym gaps
- Confidence score distribution for correct vs incorrect matches
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.faq_service import FAQService
from tests.eval_dataset import CORE_CASES, OUT_OF_DOMAIN_CASES, KNOWN_LIMITATION_CASES


def run_evaluation():
    service = FAQService()
    print(f"Loaded {len(service.faqs)} FAQs\n")

    # ---------- Core accuracy ----------
    print("=" * 60)
    print("CORE ACCURACY (paraphrased queries -> correct FAQ)")
    print("=" * 60)

    correct = 0
    failures = []
    confidences_correct = []
    start = time.perf_counter()

    for expected_id, query in CORE_CASES:
        result = service.ask(query)
        confidence = result.confidence
        if result.matched and result.faq_id == expected_id:
            correct += 1
            confidences_correct.append(confidence)
        else:
            failures.append((query, expected_id, result.faq_id, confidence))

    elapsed = time.perf_counter() - start
    total = len(CORE_CASES)
    accuracy = correct / total * 100

    print(f"Accuracy: {correct}/{total} ({accuracy:.1f}%)")
    print(f"Avg confidence on correct matches: {sum(confidences_correct)/len(confidences_correct):.3f}")
    print(f"Total time for {total} queries: {elapsed*1000:.1f}ms ({elapsed*1000/total:.2f}ms/query avg)")

    if failures:
        print(f"\nFailed cases ({len(failures)}):")
        for query, expected, got, conf in failures:
            print(f"  '{query}' -> expected FAQ #{expected}, got FAQ #{got} (confidence={conf:.3f})")

    # ---------- Out-of-domain precision ----------
    print("\n" + "=" * 60)
    print("OUT-OF-DOMAIN PRECISION (irrelevant queries -> should NOT match)")
    print("=" * 60)

    correctly_rejected = 0
    false_positives = []

    for query in OUT_OF_DOMAIN_CASES:
        result = service.ask(query)
        if not result.matched:
            correctly_rejected += 1
        else:
            false_positives.append((query, result.question, result.confidence))

    ood_total = len(OUT_OF_DOMAIN_CASES)
    ood_precision = correctly_rejected / ood_total * 100
    print(f"Correctly rejected: {correctly_rejected}/{ood_total} ({ood_precision:.1f}%)")

    if false_positives:
        print(f"\nFalse positives ({len(false_positives)}) — irrelevant queries that WRONGLY matched:")
        for query, matched_q, conf in false_positives:
            print(f"  '{query}' -> matched '{matched_q}' (confidence={conf:.3f})")

    # ---------- Known limitations ----------
    print("\n" + "=" * 60)
    print("KNOWN LIMITATIONS (acronym/synonym gaps — informational only)")
    print("=" * 60)

    limitation_pass = 0
    for expected_id, query in KNOWN_LIMITATION_CASES:
        result = service.ask(query)
        status = "MATCHED" if (result.matched and result.faq_id == expected_id) else "missed (expected)"
        if result.matched and result.faq_id == expected_id:
            limitation_pass += 1
        print(f"  '{query}' -> {status} (confidence={result.confidence:.3f})")

    print(f"\n{limitation_pass}/{len(KNOWN_LIMITATION_CASES)} acronym queries happened to match "
          f"(expected: mostly 0 — this is the documented TF-IDF lexical-matching limitation)")

    # ---------- Summary ----------
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Core matching accuracy:      {accuracy:.1f}%  ({correct}/{total})")
    print(f"Out-of-domain precision:     {ood_precision:.1f}%  ({correctly_rejected}/{ood_total})")
    print(f"Avg query response time:     {elapsed*1000/total:.2f}ms")
    print(f"Similarity threshold:        {service.matcher.similarity_threshold}")

    return {
        "core_accuracy": accuracy,
        "ood_precision": ood_precision,
        "avg_response_ms": elapsed * 1000 / total,
        "failures": failures,
        "false_positives": false_positives,
    }


if __name__ == "__main__":
    run_evaluation()
