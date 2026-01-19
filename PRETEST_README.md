# NSPFRP Pretest Suite

## Overview

The pretest suite validates all NSPFRP components before handover to next octave testing. It creates a comprehensive handover snapshot with system state, test scenarios, and instructions.

## Running Pretests

### Basic Usage

```bash
npm run pretest
```

### With Environment Variables

```bash
# Set target octave
TARGET_OCTAVE=4 npm run pretest

# Enable git operations
GIT_ENABLED=true \
GIT_REPO_PATH=./ \
GIT_BRANCH=main \
GIT_REMOTE=origin \
GIT_AUTO_COMMIT=true \
GIT_AUTO_PUSH=false \
npm run pretest
```

## Output Files

After running pretests, the following files are generated:

1. **pretest-report.txt** - Detailed pretest results
2. **handover-snapshot.json** - Complete handover snapshot (JSON)
3. **handover-report.txt** - Human-readable handover report

## Pretest Components

The suite tests:

### Core Systems
- ✅ Transmission Gears (all 6 octaves)
- ✅ Full Sensory Reality Retrieval Engine
- ✅ Hero Host System
- ✅ Identity System (Wallet, Trading Card, Passport)

### Protocol Systems
- ✅ POB Snapshots
- ✅ Cloud Deployment (8 platforms)
- ✅ Protocol Snapshots
- ✅ Git Operations

### Enterprise Systems
- ✅ Enterprise Sales Console
- ✅ Revenue Model

### Mission Craft
- ✅ Mission Creation & Planning
- ✅ Orchestrator
- ✅ Dashboard

### Integration
- ✅ End-to-end workflows

## Handover Snapshot

The handover snapshot includes:

1. **Pretest Report** - All test results
2. **System State** - Current system configuration
3. **Protocol Catalog** - All active protocols
4. **Next Octave Config** - Target octave and requirements
5. **Handover Instructions** - Step-by-step guide

## Next Octave Testing

### Prerequisites

All pretests must pass (or have acceptable warnings):
- ✅ All core systems functional
- ✅ Protocol systems operational
- ✅ Enterprise systems ready
- ✅ Integration tests passing

### Test Scenarios

1. **High-Octave Mission Execution**
   - Execute complex multi-domain mission
   - Verify protocol generation
   - Validate snapshot creation

2. **Enterprise Sales Console at High Octave**
   - Test venue onboarding
   - Execute all sales buttons
   - Verify revenue calculations

3. **Autonomous Discovery at High Octave**
   - Test autonomous protocol discovery
   - Validate catalog synchronization
   - Test POB snapshot creation

### Success Criteria

- **Performance:**
  - Latency < 500ms
  - Throughput > 100 ops/sec
  - Accuracy > 95%

- **Reliability:**
  - Uptime > 99.9%
  - Error Rate < 0.1%

- **Scalability:**
  - Max Concurrent Missions: 100
  - Max Protocols: 10,000

## Handover Process

1. **Review Pretest Report**
   - Check all components
   - Review warnings
   - Validate system state

2. **Configure for Next Octave**
   - Set transmission gear to target octave
   - Select appropriate Hero Host
   - Initialize required systems

3. **Execute Test Scenarios**
   - Run all test scenarios
   - Monitor performance
   - Validate results

4. **Validate Success Criteria**
   - Check performance metrics
   - Verify reliability
   - Test scalability

5. **Document Results**
   - Capture test results
   - Document any issues
   - Create final snapshot

## Rollback Procedure

If issues occur:

1. Stop all active missions
2. Revert transmission gear to previous octave
3. Restore previous system state if needed
4. Review error logs
5. Document issues
6. Plan remediation

---

**Protocol ID:** `P-PRETEST-V17`  
**Version:** `17.0+Pretest`  
**Status:** Ready for Next Octave Testing


